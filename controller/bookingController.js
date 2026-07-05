import {
    getAllBookings,
    createBooking,
    getBookingById,
    updateBooking,
    getBookingsByUser,
    setBookingStatus,
    rescheduleBooking,
    pendingBookingRepo
} from "../repositiory/bookingRepository.js";

function extractUserId(req) {
    return req.user?.user_id || req.user?.userId || req.user?.id || null;
}

export async function getAllBooking(req, res) {
    try {
        const result = await getAllBookings();
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function createNewBooking(req, res) {
    try {
        const userId = extractUserId(req) || req.body.userId;
        const payload = { ...req.body, userId };
        if (!payload.userId || !payload.roomId || !payload.startTime || !payload.endTime || !payload.title) {
            return res.status(400).json({ error: 'Missing required booking fields' });
        }
        const booking = await createBooking(payload);
        return res.status(201).json(booking);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create booking' });
    }
}

export async function getBookingsForUser(req, res) {
    try {
        const userId = extractUserId(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const bookings = await getBookingsByUser(userId);
        return res.json(bookings);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getBooking(req, res) {
    try {
        const { booking_id } = req.params;
        const booking = await getBookingById(booking_id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        return res.json(booking);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function putBooking(req, res) {
    try {
        const { booking_id } = req.params;
        const userId = extractUserId(req);
        const booking = await getBookingById(booking_id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        // allow owner or admin
        if (booking.userId !== userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const updated = await updateBooking(booking_id, req.body);
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function ensureBookingExists(res, booking_id) {
    const booking = await getBookingById(booking_id);
    if (!booking) {
        res.status(404).json({ error: 'Booking not found' });
        return null;
    }
    return booking;
}

export async function approveBooking(req, res) {
    try {
        const { booking_id } = req.params;
        const booking = await ensureBookingExists(res, booking_id);
        if (!booking) return;
        // only admin can approve or the owner
        const userId = extractUserId(req);
        if (req.user?.role !== 'admin' && booking.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const updated = await setBookingStatus(booking_id, 'approved');
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function rejectBooking(req, res) {
    try {
        const { booking_id } = req.params;
        const { reason } = req.body;
        const booking = await ensureBookingExists(res, booking_id);
        if (!booking) return;
        if (req.user?.role !== 'admin' && booking.userId !== extractUserId(req)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const updated = await setBookingStatus(booking_id, 'rejected', { rejectionReason: reason });
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function cancelBooking(req, res) {
    try {
        const { booking_id } = req.params;
        const booking = await ensureBookingExists(res, booking_id);
        if (!booking) return;
        const userId = extractUserId(req);
        if (booking.userId !== userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const updated = await setBookingStatus(booking_id, 'cancelled');
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function completeBooking(req, res) {
    try {
        const { booking_id } = req.params;
        const booking = await ensureBookingExists(res, booking_id);
        if (!booking) return;
        if (req.user?.role !== 'admin' && booking.userId !== extractUserId(req)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const updated = await setBookingStatus(booking_id, 'completed');
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function noShowBooking(req, res) {
    try {
        const { booking_id } = req.params;
        const booking = await ensureBookingExists(res, booking_id);
        if (!booking) return;
        if (req.user?.role !== 'admin' && booking.userId !== extractUserId(req)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const updated = await setBookingStatus(booking_id, 'no-show');
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function rescheduleBookingHandler(req, res) {
    try {
        const { booking_id } = req.params;
        const { startTime, endTime } = req.body;
        const booking = await ensureBookingExists(res, booking_id);
        if (!booking) return;
        if (booking.userId !== extractUserId(req) && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        if (!startTime || !endTime) return res.status(400).json({ error: 'Missing new startTime or endTime' });
        const updated = await rescheduleBooking(booking_id, startTime, endTime);
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function pendingBooking(req,res) {
    try{
        const result = await pendingBookingRepo();
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
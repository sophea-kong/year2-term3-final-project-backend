import { DatabaseError, DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const User = sequelize.define('User', {
  userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' },
  status: { type: DataTypes.ENUM('active', 'inactive', 'banned'), defaultValue: 'active' },
  department: { type: DataTypes.STRING(100), allowNull: true },
  googleAccessToken : {type : DataTypes.TEXT,allowNull: true},
  googleRefreshToken : { type : DataTypes.TEXT,allowNull:true},
  googleTokenExpiry  : { type :DataTypes.BIGINT, allowNull:true},
  creditBalance: { type: DataTypes.INTEGER, defaultValue: 100 }
}, { tableName: 'USER', timestamps: false });

export const Room = sequelize.define('Room', {
  roomId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roomName: { type: DataTypes.STRING(100), allowNull: false },
  building: { type: DataTypes.STRING(100), allowNull: false },
  floor: { type: DataTypes.INTEGER, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  roomType: { type: DataTypes.STRING(50), allowNull: false },
  equipment: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('available', 'unavailable', 'maintenance'), defaultValue: 'available' }
}, { tableName: 'ROOM', timestamps: false });

export const Booking = sequelize.define('Booking', {
  bookingId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(150), allowNull: false },
  purpose: { type: DataTypes.TEXT, allowNull: true },
  participantCount: { type: DataTypes.INTEGER, defaultValue: 1 },
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled', 'completed', 'no-show', 'rescheduled'), defaultValue: 'pending' },
  rejectionReason: { type: DataTypes.TEXT, allowNull: true },
  googleEventId: { type: DataTypes.STRING(255), allowNull: true }
}, { tableName: 'BOOKING', timestamps: false });

export const DigitalTicket = sequelize.define('DigitalTicket', {
  ticketId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  ticketCode: { type: DataTypes.STRING(64), allowNull: false, unique: true },
  qrCode: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('valid', 'used', 'cancelled', 'expired'), defaultValue: 'valid' },
  generatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'DIGITAL_TICKET', timestamps: false });





export const BanRecord = sequelize.define('BanRecord', {
  banId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bannedBy: { type: DataTypes.INTEGER, allowNull: false },
  reason: { type: DataTypes.TEXT, allowNull: false },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: true },
  status: { type: DataTypes.ENUM('active', 'lifted', 'expired'), defaultValue: 'active' }
}, { tableName: 'BAN_RECORD', timestamps: false });



export const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
  maintenanceId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  reportedBy: { type: DataTypes.INTEGER, allowNull: false },
  issueTitle: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'), defaultValue: 'open' }
}, { tableName: 'MAINTENANCE_REQUEST', timestamps: false });

export const Schedule = sequelize.define('Schedule', {
  scheduleId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  bookingId: { type: DataTypes.INTEGER, allowNull: true },
  title: { type: DataTypes.STRING(150), allowNull: false },
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false },
  type: { type: DataTypes.STRING(50), allowNull: false }
}, { tableName: 'SCHEDULE', timestamps: false });

export const RoomImage = sequelize.define('RoomImage', {
  imageId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  imageUrl: { type: DataTypes.STRING(255), allowNull: false }
}, { tableName: 'ROOM_IMAGE', timestamps: false });

export const CreditTransaction = sequelize.define('CreditTransaction', {
  transactionId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('addition', 'deduction'), allowNull: false },
  reason: { type: DataTypes.STRING(255), allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'CREDIT_TRANSACTION', timestamps: false });

// Define Relationships

// User & Booking
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

// Room & Booking
Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

// Room & RoomImage
Room.hasMany(RoomImage, { foreignKey: 'roomId', as: 'images', onDelete: 'CASCADE' });
RoomImage.belongsTo(Room, { foreignKey: 'roomId' });

// Booking & DigitalTicket
Booking.hasOne(DigitalTicket, { foreignKey: 'bookingId' });
DigitalTicket.belongsTo(Booking, { foreignKey: 'bookingId' });





// User & BanRecord
User.hasMany(BanRecord, { foreignKey: 'userId' });
BanRecord.belongsTo(User, { foreignKey: 'userId' });



// User & MaintenanceRequest
User.hasMany(MaintenanceRequest, { foreignKey: 'reportedBy' });
MaintenanceRequest.belongsTo(User, { foreignKey: 'reportedBy' });

// Room & MaintenanceRequest
Room.hasMany(MaintenanceRequest, { foreignKey: 'roomId' });
MaintenanceRequest.belongsTo(Room, { foreignKey: 'roomId' });

// Room & Schedule
Room.hasMany(Schedule, { foreignKey: 'roomId' });
Schedule.belongsTo(Room, { foreignKey: 'roomId' });

// User & CreditTransaction
User.hasMany(CreditTransaction, { foreignKey: 'userId' });
CreditTransaction.belongsTo(User, { foreignKey: 'userId' });

// Booking & Schedule
Booking.hasOne(Schedule, { foreignKey: 'bookingId' });
Schedule.belongsTo(Booking, { foreignKey: 'bookingId' });

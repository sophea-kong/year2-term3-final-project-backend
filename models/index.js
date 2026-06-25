import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import { sequelize } from '../db/database.js';

// Models
export const User = sequelize.define('user', {
  userid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'userid' },
  fullname: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'active' },
}, {
  tableName: 'user',
  timestamps: false // Adjust if you have created_at/updated_at
});

export const Booking = sequelize.define('booking', {
  bookingid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'bookingid' },
  userid: { type: DataTypes.INTEGER, references: { model: User, key: 'userid' }, field: 'userid' },
}, {
  tableName: 'booking',
  timestamps: false
});

export const DigitalTicket = sequelize.define('digital_ticket', {
  ticketid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'ticketid' },
  bookingid: { type: DataTypes.INTEGER, references: { model: Booking, key: 'bookingid' }, field: 'bookingid' },
  ticketCode: { type: DataTypes.STRING, field: 'ticketCode' },
  qrcode: { type: DataTypes.STRING, field: 'qrcode' },
  status: { type: DataTypes.STRING, field: 'status' },
  generatedAt: { type: DataTypes.DATE, field: 'generatedAt' }
}, {
  tableName: 'digital_ticket',
  timestamps: false
});

export const Notification = sequelize.define('notification', {
  notificationid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'notificationid' },
  userid: { type: DataTypes.INTEGER, references: { model: User, key: 'userid' }, field: 'userid' },
  title: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  type: { type: DataTypes.STRING },
  isread: { type: DataTypes.BOOLEAN },
  createdat: { type: DataTypes.DATE, field: 'createdat' }
}, {
  tableName: 'notification',
  timestamps: false
});

// Relationships
User.hasMany(Booking, { foreignKey: 'userid' });
Booking.belongsTo(User, { foreignKey: 'userid' });

Booking.hasMany(DigitalTicket, { foreignKey: 'bookingid' });
DigitalTicket.belongsTo(Booking, { foreignKey: 'bookingid' });

User.hasMany(Notification, { foreignKey: 'userid' });
Notification.belongsTo(User, { foreignKey: 'userid' });

import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        res.json(notifications);
    } catch (error) {
        console.error("Get Notifications Error:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        await prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true }
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Mark Read Error:", error);
        res.status(500).json({ error: "Failed to mark as read" });
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Mark All Read Error:", error);
        res.status(500).json({ error: "Failed to mark all as read" });
    }
};

// Internal utility to create notifications
export const createNotification = async (userId: string, title: string, message: string, type: 'INFO' | 'WARNING' | 'SUCCESS' = 'INFO') => {
    try {
        await prisma.notification.create({
            data: { userId, title, message, type }
        });
    } catch (e) {
        console.error("Failed to create notification", e);
    }
};

import Notification from "../models/notification_model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ to: req.user._id })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "from",
        select: "username profileImg",
      });

    await Notification.updateMany({ to: userId }, { $set: { read: true } });

    res.status(200).json(notifications);
  } catch (error) {
    console.log("the error in getNotification controller is", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({to:req.user._id})
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.log("the error in deleteNotifications is ", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  config: {
    name: "autoleave",
    version: "1.0.0",
    author: "Mukul",
    category: "events",
    role: 0,
    shortDescription: "Leave notification"
  },

  onStart: async function ({ api, event }) {
    try {
      // এই অংশটি তোমার GoatBot V3-এর leave event অনুযায়ী
      // event.type / event.logMessageData যাচাই করবে।
      if (
        event.logMessageType !== "log:unsubscribe" ||
        !event.logMessageData
      ) {
        return;
      }

      const leftUser =
        event.logMessageData.leftParticipantFbId;

      if (!leftUser) return;

      let name = "একজন User";

      try {
        const info = await api.getUserInfo(leftUser);
        name = info?.[leftUser]?.name || name;
      } catch (e) {}

      await api.sendMessage(
        `👋 ${name} গ্রুপ থেকে Leave নিয়েছে।\n\n` +
        `🆔 UID: ${leftUser}\n` +
        `ℹ️ আবার যোগ করতে হলে Group Admin নিজে Invite করুন।`,
        event.threadID
      );

    } catch (error) {
      console.error("AUTO LEAVE EVENT ERROR:", error);
    }
  }
};

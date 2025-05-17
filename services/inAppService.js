export async function sendInAppNotification({ to, content }) {

  console.log(`Sending IN-APP notification to user ${to}: ${content}`);

  //delay to mimic time taken for in-app notif
  await new Promise((res) => setTimeout(res, 500));
  //randomly decides success or failure
  if (Math.random() < 0.9) return { success: true };

  return { success: false, error: "In-app sendin failed" };
}

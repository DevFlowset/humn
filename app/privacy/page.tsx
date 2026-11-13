import type { Metadata } from "next";
import Legal from "@/components/Legal";
import "../legal.css";

export const metadata: Metadata = {
  title: "Privacy — HUMN",
  description: "What this site collects, why, and how to have it deleted.",
};

export default function Privacy() {
  return (
    <Legal
      kicker="Privacy"
      title="Your data, kept small."
      updated="13 November 2026"
      intro="HUMN isn’t open yet. This page covers this website and the waitlist only. The app will ship with its own privacy policy before anyone uploads a scan."
      sections={[
        {
          h: "What we collect",
          body: (
            <>
              <p>Only the email address you type into the waitlist form. Nothing else is asked for.</p>
              <p>Like any website, our hosting provider sees basic technical data when you visit, such as your IP address and browser type. We use it to keep the site running and secure, not to profile you.</p>
            </>
          ),
        },
        {
          h: "Why we collect it",
          body: <p>To tell you when your spot opens. We email you when it’s your turn. No newsletters unless you ask for them.</p>,
        },
        {
          h: "Cookies and tracking",
          body: <p>This site sets no cookies and runs no ads or third-party trackers. Fonts are served from our own domain.</p>,
        },
        {
          h: "Who we share it with",
          body: (
            <>
              <p>Nobody, for marketing. We never sell your data.</p>
              <p>Your email is stored with the services we use to host this site and keep the waitlist. They process it for us and for no other purpose.</p>
            </>
          ),
        },
        {
          h: "How long we keep it",
          body: <p>Until launch, or until you ask us to delete it, whichever comes first.</p>,
        },
        {
          h: "Your choices",
          body: <p>Want your email removed, or a copy of what we hold? Reply to any email we send you and we’ll take care of it. Depending on where you live, you may have further rights, such as correcting your data or objecting to how it’s used.</p>,
        },
        {
          h: "Body photos, later",
          body: <p>When the app launches, posture photos stay private by default, you can delete them anytime, and they are never sold. The app’s privacy policy will set this out in full.</p>,
        },
        {
          h: "Changes",
          body: <p>If this page changes, we’ll update the date at the top.</p>,
        },
      ]}
    />
  );
}

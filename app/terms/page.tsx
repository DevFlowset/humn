import type { Metadata } from "next";
import Legal from "@/components/Legal";
import "../legal.css";

export const metadata: Metadata = {
  title: "Terms — HUMN",
  description: "The ground rules for this website and the HUMN waitlist.",
};

export default function Terms() {
  return (
    <Legal
      kicker="Terms"
      title="The ground rules."
      updated="13 November 2026"
      intro="These terms cover this website and the HUMN waitlist. The app will come with its own terms at launch."
      sections={[
        {
          h: "Using this site",
          body: <p>You can browse the site and join the waitlist for free. Please don’t misuse it, for example by trying to break it, scraping it, or signing up other people without asking them.</p>,
        },
        {
          h: "The waitlist",
          body: <p>Joining the waitlist doesn’t guarantee access, a launch date or a price. We’ll let people in when we’re ready, and we may do it in stages.</p>,
        },
        {
          h: "Not medical advice",
          body: (
            <>
              <p>HUMN is a wellness and fitness product. Nothing on this site is medical advice, a diagnosis or a treatment.</p>
              <p>If you have pain, an injury or a health condition, talk to a doctor or physiotherapist before starting a new exercise routine.</p>
            </>
          ),
        },
        {
          h: "Previews, not promises",
          body: <p>Screens, chats, numbers and features shown here are previews of what we’re building. They may change before launch, and results depend on the person.</p>,
        },
        {
          h: "Our content",
          body: <p>The HUMN name, logo, design and copy belong to us. Please don’t copy or reuse them without permission.</p>,
        },
        {
          h: "Liability",
          body: <p>We provide this site as it is. As far as the law allows, we’re not liable for losses that come from using it. Nothing here limits rights you have that the law says can’t be limited.</p>,
        },
        {
          h: "Changes and contact",
          body: <p>We may update these terms as HUMN grows. We’ll change the date at the top when we do. Questions? Reply to any email we send you.</p>,
        },
      ]}
    />
  );
}

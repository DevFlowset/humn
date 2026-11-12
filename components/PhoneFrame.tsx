import type { ReactNode } from "react";

/** Static device frame (dark). Screens render inside .ph-sc below the status bar. */
export default function PhoneFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="phone hn-ui" role="img" aria-label={label}>
      <i className="ph-btn l1"></i>
      <i className="ph-btn l2"></i>
      <i className="ph-btn l3"></i>
      <i className="ph-btn r1"></i>
      <div className="ph-bz">
        <div className="ph-sc">
          <div className="ph-st">
            <span className="st-t">9:41</span>
            <span className="st-r">
              <svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx=".8"></rect><rect x="5" y="5.5" width="3" height="6.5" rx=".8"></rect><rect x="10" y="3" width="3" height="9" rx=".8"></rect><rect x="15" y="0" width="3" height="12" rx=".8"></rect></svg>
              <svg viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.6l1.9-2a2.7 2.7 0 0 0-3.8 0zM3.9 7.4l1.2 1.3a4.9 4.9 0 0 1 5.8 0l1.2-1.3a6.7 6.7 0 0 0-8.2 0zM.8 4.2l1.2 1.3a9.3 9.3 0 0 1 12 0l1.2-1.3a11.2 11.2 0 0 0-14.4 0z"></path></svg>
              <svg viewBox="0 0 27 13" aria-hidden="true"><rect className="bo" x=".5" y=".5" width="22" height="12" rx="3.6"></rect><rect x="2" y="2" width="19" height="9" rx="2.2"></rect><path d="M24 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" opacity=".45"></path></svg>
            </span>
          </div>
          <div className="isl"></div>
          <div className="fs-area">{children}</div>
          <div className="ph-gl"></div>
        </div>
      </div>
    </div>
  );
}

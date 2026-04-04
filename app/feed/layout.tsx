import Navbar from './partials/Navbar';
import MobileNav from './partials/MobileNav';
import LeftSidebar from './partials/LeftSidebar';
import RightSidebar from './partials/RightSidebar';
import DarkModeToggle from '../components/DarkModeToggle';

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="_layout _layout_main_wrapper">
      <DarkModeToggle />

      <div className="_main_layout">
        <Navbar />
        <MobileNav />

        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <LeftSidebar />

              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    {children}
                  </div>
                </div>
              </div>

              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { authClient } from '@/app/lib/auth-client';

const notifications = [
  { id: 1, image: '/assets/images/friend-req.png', text: 'Steve Jobs posted a link in your timeline.' },
  { id: 2, image: '/assets/images/profile-1.png', text: 'An admin changed the name of the group Freelancer usa to Freelancer usa.' },
  { id: 3, image: '/assets/images/friend-req.png', text: 'Steve Jobs posted a link in your timeline.' },
  { id: 4, image: '/assets/images/profile-1.png', text: 'An admin changed the name of the group Freelancer usa to Freelancer usa.' },
];

export default function Navbar() {
  const [showNotify, setShowNotify] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifyRef = useRef<HTMLLIElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userImage = user?.image || '/assets/images/profile.png';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifyRef.current && !notifyRef.current.contains(e.target as Node)) {
        setShowNotify(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    await authClient.signOut();
    window.location.href = '/auth/login';
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
      <div className="container _custom_container">
        <div className="_logo_wrap">
          <Link className="navbar-brand" href="/feed">
            <Image
              src="/assets/images/logo.svg"
              alt="Image"
              width={120}
              height={36}
              className="_nav_logo"
            />
          </Link>
        </div>

        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="navbar-collapse"
          id="navbarSupportedContent"
          style={{ display: 'flex', flexBasis: 'auto', alignItems: 'center' }}
        >
          <div className="_header_form ms-auto">
            <form className="_header_form_grp">
              <svg
                className="_header_form_svg"
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                fill="none"
                viewBox="0 0 17 17"
              >
                <circle cx="7" cy="7" r="6" stroke="#666" />
                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
              <input
                className="form-control me-2 _inpt1"
                type="search"
                placeholder="input search text"
                aria-label="Search"
              />
            </form>
          </div>

          <ul className="navbar-nav mb-2 mb-lg-0 _header_nav_list ms-auto _mar_r8">
            <li className="nav-item _header_nav_item">
              <Link className="nav-link _header_nav_link_active _header_nav_link" aria-current="page" href="/feed">
                Home
              </Link>
            </li>

            <li className="nav-item _header_nav_item">
              <Link className="nav-link _header_nav_link" aria-current="page" href="/friend-request">
                Friends
              </Link>
            </li>

            <li ref={notifyRef} className="nav-item _header_nav_item" style={{ position: 'relative' }}>
              <span
                className="nav-link _header_nav_link _header_notify_btn"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setShowNotify((prev) => !prev);
                  setShowProfile(false);
                }}
              >
                Notifications
                <span className="_counting">6</span>
              </span>

              <div id="_notify_drop" className={`_notification_dropdown${showNotify ? ' show' : ''}`}>
                <div className="_notifications_content">
                  <h4 className="_notifications_content_title">Notifications</h4>
                </div>

                <div className="_notifications_drop_box">
                  <div className="_notifications_all">
                    {notifications.map((n) => (
                      <div key={n.id} className="_notification_box">
                        <div className="_notification_image">
                          <Image src={n.image} alt="" width={40} height={40} className="_notify_img" />
                        </div>
                        <div className="_notification_txt">
                          <p className="_notification_para">{n.text}</p>
                          <div className="_nitification_time">
                            <span>42 minutes ago</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </li>

            <li className="nav-item _header_nav_item">
              <Link className="nav-link _header_nav_link" aria-current="page" href="/chat">
                Chat
                <span className="_counting">2</span>
              </Link>
            </li>
          </ul>

          <div ref={profileRef} className="_header_nav_profile" style={{ position: 'relative' }}>
            <div className="_header_nav_profile_image">
              <Image
                src={userImage}
                alt={userName}
                width={36}
                height={36}
                className="_nav_profile_img"
              />
            </div>

            <div className="_header_nav_dropdown">
              <p className="_header_nav_para">
                {isPending ? 'Loading...' : userName}
              </p>

              <button
                id="_profile_drop_show_btn"
                className="_header_nav_dropdown_btn _dropdown_toggle"
                type="button"
                onClick={() => {
                  setShowProfile((prev) => !prev);
                  setShowNotify(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
                  <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                </svg>
              </button>
            </div>

            <div id="_prfoile_drop" className={`_nav_profile_dropdown _profile_dropdown${showProfile ? ' show' : ''}`}>
              <div className="_nav_profile_dropdown_info">
                <div className="_nav_profile_dropdown_image">
                  <Image
                    src={userImage}
                    alt={userName}
                    width={48}
                    height={48}
                    className="_nav_drop_img"
                  />
                </div>

                <div className="_nav_profile_dropdown_info_txt">
                  <h4 className="_nav_dropdown_title">{userName}</h4>
                  {userEmail && <p className="_nav_dropdown_email">{userEmail}</p>}
                  <Link href="/profile" className="_nav_drop_profile">
                    View Profile
                  </Link>
                </div>
              </div>

              <hr />

              <ul className="_nav_dropdown_list">
                <li className="_nav_dropdown_list_item">
                  <Link href="#" className="_nav_dropdown_link">
                    <div className="_nav_drop_info">Settings</div>
                  </Link>
                </li>

                <li className="_nav_dropdown_list_item">
                  <Link href="#" className="_nav_dropdown_link">
                    <div className="_nav_drop_info">Help &amp; Support</div>
                  </Link>
                </li>

                <li className="_nav_dropdown_list_item">
                  <button
                    type="button"
                    className="_nav_dropdown_link"
                    onClick={handleLogout}
                    style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
                  >
                    <div className="_nav_drop_info">Log Out</div>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

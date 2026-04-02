"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { timeAgo } from "../../../utils/utils";

interface Props {
  authorName: string;
  authorImage: string | null;
  createdAt: string;
  privacy: "public" | "private";
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
}

export default function PostHeader({
  authorName,
  authorImage,
  createdAt,
  privacy,
  showDropdown,
  onToggleDropdown,
  onCloseDropdown,
}: Props) {
  const dropRef = useRef<HTMLDivElement>(null);

  return (
    <div className="_feed_inner_timeline_post_top">
      <div className="_feed_inner_timeline_post_box">
        <div className="_feed_inner_timeline_post_box_image">
          {authorImage ? (
            <Image
              src={authorImage}
              alt={authorName}
              width={44}
              height={44}
              className="_post_img"
            />
          ) : (
            <div
              className="_post_img"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: 18,
                color: "#666",
              }}
            >
              {authorName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="_feed_inner_timeline_post_box_txt">
          <h4 className="_feed_inner_timeline_post_box_title">{authorName}</h4>
          <p className="_feed_inner_timeline_post_box_para">
            {timeAgo(createdAt)} &middot;{" "}
            <Link href="#">
              {privacy === "public" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}{" "}
              {privacy}
            </Link>
          </p>
        </div>
      </div>

      <div className="_feed_inner_timeline_post_box_dropdown" ref={dropRef}>
        <div className="_feed_timeline_post_dropdown">
          <button
            type="button"
            className="_feed_timeline_post_dropdown_link"
            onClick={onToggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="17"
              fill="none"
              viewBox="0 0 4 17"
            >
              <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
              <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
              <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
            </svg>
          </button>
        </div>
        <div
          className={`_feed_timeline_dropdown _timeline_dropdown${showDropdown ? " show" : ""}`}
        >
          <ul className="_feed_timeline_dropdown_list">
            {[
              "Save Post",
              "Turn On Notification",
              "Hide",
              "Edit Post",
              "Delete Post",
            ].map((item) => (
              <li key={item} className="_feed_timeline_dropdown_item">
                <Link
                  href="#"
                  className="_feed_timeline_dropdown_link"
                  onClick={onCloseDropdown}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import type { Reply } from "@/app/lib/models/post";
import { timeAgo } from "../../../utils/utils";

interface Props {
  reply: Reply;
  currentUserId: string;
  onLike: () => void;
}

export default function ReplyItem({ reply, currentUserId, onLike }: Props) {
  const isLiked = reply.likes.includes(currentUserId);

  return (
    <div className="_comment_main" style={{ marginBottom: 10 }}>
      <div className="_comment_image">
        {reply.authorImage ? (
          <Image
            src={reply.authorImage}
            alt={reply.authorName}
            width={32}
            height={32}
            className="_comment_img1"
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 13,
              color: "#666",
            }}
          >
            {reply.authorName?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="_comment_area">
        <div className="_comment_details" style={{ marginBottom: 8 }}>
          <div className="_comment_name">
            <h4 className="_comment_name_title" style={{ fontSize: 13 }}>
              {reply.authorName}
            </h4>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{reply.text}</span>
            </p>
          </div>
          {reply.likes.length > 0 && (
            <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </span>
              </div>
              <span className="_total">{reply.likes.length}</span>
            </div>
          )}
        </div>
        <div className="_comment_reply">
          <ul
            className={`_comment_reply_list gap-1 ${reply.likes.length > 0 ? "pt-3" : "pt-0"}`}
          >
            <li>
              <span
                role="button"
                tabIndex={0}
                style={{
                  color: isLiked ? "#1877f2" : undefined,
                  fontWeight: isLiked ? 600 : undefined,
                  cursor: "pointer",
                  fontSize: 12,
                }}
                onClick={onLike}
                onKeyDown={(e) => e.key === "Enter" && onLike()}
              >
                {isLiked ? "Liked" : "Like"}
              </span>
            </li>
            <li>
              <span className="_time_link" style={{ fontSize: 12 }}>
                {timeAgo(reply.createdAt)}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

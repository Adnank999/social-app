'use client';

import Image from 'next/image';

interface Props {
  likesCount: number;
  commentsCount: number;
  onToggleComments: () => void;
}

export default function PostReactionBar({ likesCount, commentsCount, onToggleComments }: Props) {
  return (
    <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24">
      <div className="_feed_inner_timeline_total_reacts_image">
        <Image src="/assets/images/react_img1.png" alt="" width={32} height={32} className="_react_img1" />
        <Image src="/assets/images/react_img2.png" alt="" width={32} height={32} className="_react_img" />
        <Image src="/assets/images/react_img3.png" alt="" width={32} height={32} className="_react_img _rect_img_mbl_none" />
        <p className="_feed_inner_timeline_total_reacts_para">
          {likesCount > 0 ? `${likesCount}` : ''}
        </p>
      </div>
      <div className="_feed_inner_timeline_total_reacts_txt">
        <p className="_feed_inner_timeline_total_reacts_para1">
          <button
            type="button"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit' }}
            onClick={onToggleComments}
          >
            <span>{commentsCount}</span> Comment{commentsCount !== 1 ? 's' : ''}
          </button>
        </p>
        <p className="_feed_inner_timeline_total_reacts_para2">
          <span>0</span> Share
        </p>
      </div>
    </div>
  );
}

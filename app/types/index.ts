import { ReactNode } from 'react';

export interface Stat {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  color?: 'primary' | 'accent1' | 'accent2' | 'accent3';
}

// Thêm các interface khác ở đây
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
    fill?: boolean;
  }[];
}

export interface TablePostData {
  post_keyword: string;
  post_url : string;
  author_username: string;
  message: string;
  content_created: string;
  post_created_timestamp: number;
  hours_diff: number;
  count_like: number;
  count_comments: number;
  count_share: number;
  post_image: string| null;
  post_type: string;
} 

export interface TableCommentsData {
  comment_url : string,
  name: string;
  content: string;
  content_created: string;
  created_at: string;
  hours_diff: number;
  reply_count: number;
  author_url: string;
  post_id: number;
} 


export interface TablePostDataMock {
  posturl : string,
  name: string;
  content: string;
  content_created: string;
  reaction_count: number;
  comment_count: number;
  share_count: number;
  image_url: string| null;
  type: string;
} 

export interface TableGroupData {
  group_id : string,
  group_name: string;
  group_type: string;
  last_crawled: string;
} 

export interface HoaDon {
  id: number;
  thoi_gian: string;
  nguoi_gui: string;
  ten_khach: string;
  so_dien_thoai: string;
  type_dao_rut: string;
  ngan_hang: string;
  ngay_giao_dich: string;
  gio_giao_dich: string;
  tong_so_tien: string;
  so_the: string;
  tid: string;
  mid: string;
  so_lo: string;
  so_hoa_don: string;
  ten_may_pos: string;
  lich_canh_bao: string;
  tien_phi: string;
  batch_id: string;
  caption_goc: string;
  ck_ra?: string;
  ck_vao?: string;
  stk_khach?: string;
  stk_cty?: string;
  tinh_trang?: string;
  ly_do?: string;
  dia_chi?: string;
  khach_moi?: boolean;
  phan_tram_phi?: string;
  key_redis?: string;
  ma_chuyen_khoan?: string;
  lich_canh_bao_datetime?: string;
  created_at?: string;
  updated_at?: string;
  phi_per_bill?: string;
}

export interface GroupedHoaDon {
  [batch_id: string]: HoaDon[];
}

export interface DashboardStats {
  totalRecords: number;
  totalBatches: number;
  totalAmount: number;
  totalFee: number;
}

export interface HoaDonGroup {
  batch_id: string;
  records: HoaDon[];
} 


export interface SearchPostResult {
  posturl: string,
  name: string,
  content: string,
  content_created: string,
  created_at: string,
  delay: number,
  reaction_count: number,
  comment_count: number,
  share_count: number,
  image_url: string,
  type: string,
}
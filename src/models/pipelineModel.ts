export default interface Pipeline {
  id_category_project: number;
  uuid: string;
  project_name: string;
  id_user_sales: number;
  id_end_user: number;
  id_pic_project: number;
  product_price: number;
  service_price: number;
  margin: number;
  estimated_closed_date: Date;
  estimated_delivered_date: Date;
  description?: string;
  status: string;
  file_url?: string;
  created_at?: Date;
  updated_at: Date;
}

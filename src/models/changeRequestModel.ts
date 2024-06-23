export default interface ChangeRequest {
  id_pipeline: number;
  id_user_request: string | undefined;
  new_status: string;
  note: string | undefined;
  request_status: string | undefined;
  id_user_approval: number | undefined;
  created_at: Date;
  updated_at: Date;
  id_end_user: number;
  uuid: string;
}

export interface Email {
  id: number
  login: string
  password: string
  host: string
  port: number
}

export interface Emailer {
  documentId: number
  fromEmail: string
  toEmail: string
  message: string
  theme: string
  userId: string
  created: string
}

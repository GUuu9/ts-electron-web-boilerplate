import { Notification } from 'electron';

export class NotifyManager {
  public send(title: string, body: string) {
    new Notification({ title, body }).show();
  }
}

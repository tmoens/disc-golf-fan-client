export class CronJobStatusDto {
  constructor(public jobName: string, public nextFireDate: string) {
  }
}

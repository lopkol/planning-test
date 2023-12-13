export class SaveEventCommand {
  constructor(public readonly subject: string, public readonly payload: unknown) {}
}

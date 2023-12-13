export class ReservationCreatedEvent {
  ownerUrn: string;
  reservationUrn: string;
  activity: string;
  start: string;
  end: string;
  notes?: string;
}

export class ReservationUpdatedEvent {
  ownerUrn: string;
  reservationUrn: string;
  activity: string;
  start: string;
  end: string;
  notes?: string;
}

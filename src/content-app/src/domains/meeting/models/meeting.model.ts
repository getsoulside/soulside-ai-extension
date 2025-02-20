import { MeetingProvider, MeetingIdStatus, TranscriptProvider } from "./meeting.types";
import { SoulsideVertical, SessionCategory, ModeOfDelivery } from "@/domains/session";

export interface SoulsideMeeting {
  id: UUIDString | null;
  groupId: UUIDString | null;
  providerMeetingId: UUIDString | null;
  meetingProvider: MeetingProvider | null;
  providerResponse: JSON | null;
  startHour: number | null;
  startMinute: number | null;
  dayOfWeek: DayOfWeek | null;
  soulsideVertical: SoulsideVertical | null;
  meetingIdStatus: MeetingIdStatus | null;
  createdAt: ISO8601String;
  organizationId: UUIDString | null;
  organizationName: string | null;
  patientId: UUIDString | null;
  patientUserId: UUIDString | null;
  sessionCategory: SessionCategory | null;
}

export interface SoulsideMeetingSession {
  id: UUIDString | null;
  groupId: UUIDString | null;
  sessionId: UUIDString | null;
  providerMeetingId: UUIDString | null;
  providerSessionId: UUIDString | null;
  meetingProvider: MeetingProvider | null;
  meetingStartedWebhookEvent: JSON | null;
  soulsideVertical: SoulsideVertical | null;
  createdAt: ISO8601String;
  startedAt: ISO8601String | null;
  transcriptFileUrl: string | null;
  transcriptFileType: string | null;
  transcriptProvider: TranscriptProvider | null;
  individualSessionId: UUIDString | null;
  organizationId: UUIDString | null;
  organizationName: string | null;
  patientId: UUIDString | null;
  patientUserId: UUIDString | null;
  modeOfDelivery: ModeOfDelivery | null;
  sessionCategory: SessionCategory | null;
}

interface SoulsideMeetingSessionParticipant {
  participantId: string;
  participantName: string;
  providerParticipantId: string;
  providerPeerId: string;
}

export interface SoulsideMeetingSessionTranscript extends SoulsideMeetingSessionParticipant {
  timestamp: number;
  transcriptText: string;
}

export interface SoulsideMeetingSessionSpeakerAudio extends SoulsideMeetingSessionParticipant {
  speakerId: string | null;
  audioFileUrl: string | null;
  audioDuration?: number | null;
}

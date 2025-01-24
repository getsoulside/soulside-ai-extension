import { Session } from "@/domains/session/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionNotesTemplates } from "../models/sessionNotes.types";
import { JSONSoapNote } from "../models";

interface SessionDetailsState {
  sessionDetails: {
    data: Session;
    loading: boolean;
  };
  soapNotes: {
    notesId: String;
    loading: boolean;
    soapNotesJson: JSONSoapNote | null;
    [SessionNotesTemplates.DEFAULT_SOAP]: string | null;
  };
  sessionTranscript: {
    data: any[];
    loading: boolean;
  };
}

interface SessionState {
  sessionDetailsData: Record<string, SessionDetailsState>;
}

const initialState: SessionState = {
  sessionDetailsData: {
    "1742cffe-eb90-4f2b-8dfe-5894deba85a4": {
      sessionDetails: {
        loading: false,
        data: {
          id: "1742cffe-eb90-4f2b-8dfe-5894deba85a4",
          sessionName: "Azfar <> Robin",
          organizationId: "ca119abc-9900-46b6-92f9-62ed4d6f84e9",
          organizationName: "Serenity Health LLC",
          practitionerRoleId: "c8538df2-953b-4f7c-8a8a-a42bb28aec1e",
          practitionerId: "87571001-89de-4538-859a-dd2f0ca38847",
          practitionerFirstName: "Azfar",
          practitionerLastName: "Malik",
          practitionerEmail: "azfar.m.malik@gmail.com",
          patientId: "b7a44209-fef5-4a7a-becd-867b651f06a5",
          patientUserId: null,
          patientFirstName: "Robin",
          patientLastName: "Goodman",
          patientPhoneNumber: "(314) 651-0039",
          startTime: "2025-01-17T08:00:00-08:00",
          durationInMinutes: 15,
          endTime: "2025-01-17T08:15:00-08:00",
          sessionStatus: "SCHEDULED",
          sessionCategory: "INDIVIDUAL",
          modeOfDelivery: "VIRTUAL",
          createdAt: "2025-01-17T00:01:05.470784-08:00",
          checkInTime: null,
          actualDurationInMinutes: null,
          checkOutTime: null,
          appointmentType: "FOLLOW_UP",
        },
      },
      sessionTranscript: {
        loading: false,
        data: [
          {
            providerSessionId: "91bf974b-2c8c-4318-8de0-cb234dafb13a",
            providerSession: {
              id: "8c1f8149-e289-4f9d-981e-72487a42cdbb",
              groupId: null,
              sessionId: null,
              providerMeetingId: "bbb2aa9a-12f4-4fca-a7dc-cddda2dbeceb",
              providerSessionId: "91bf974b-2c8c-4318-8de0-cb234dafb13a",
              meetingProvider: null,
              meetingStartedWebhookEvent: null,
              soulsideVertical: null,
              createdAt: "2025-01-17T08:57:10.331766-08:00",
              startedAt: "2025-01-17T08:57:10.331768-08:00",
              transcriptFileUrl: null,
              transcriptFileType: null,
              transcriptProvider: null,
              individualSessionId: "1742cffe-eb90-4f2b-8dfe-5894deba85a4",
              organizationId: "ca119abc-9900-46b6-92f9-62ed4d6f84e9",
              organizationName: "Serenity Health LLC",
              patientId: "b7a44209-fef5-4a7a-becd-867b651f06a5",
              patientUserId: null,
              sessionCategory: "INDIVIDUAL",
              modeOfDelivery: "IN_PERSON",
            },
            transcriptData: [
              {
                timestamp: 1737102360,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Well, I've done a lot.",
              },
              {
                timestamp: 1737105000,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "Huh.",
              },
              {
                timestamp: 1737107059,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "Everything's going good. I don't know what to say. I'm, just doing things with my friends. You know, I'm retired. I paint as my hobby",
              },
              {
                timestamp: 1737120660,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "Uh-huh. I'm",
              },
              {
                timestamp: 1737121400,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "feeling good. I don't have any Any symptoms of anything I did want to talk 1 thing That you sent me uh-huh It's working wonderful for my back pain.",
              },
              {
                timestamp: 1737140140,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "Oh, I'm so happy.",
              },
              {
                timestamp: 1737142120,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "Oh my gosh, it made such a difference in my life. I just can't believe it. But there's 1 thing. There's a mix-up between your office and my pharmacy the pharmacy says to take it the prescriptions for only 2 weeks and the prescription supposed to be for 90 days.",
              },
              {
                timestamp: 1737166900,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Okay, let me take care. So let me, Dr. Asma, what's the number, what's the office key, 256? I don't, It usually comes in but I'm not sure what's going on with my computer. No, no, no. I'm asking her. Hold on. It's",
              },
              {
                timestamp: 1737185200,
                providerParticipantId: "Speaker 2",
                providerPeerId: "Speaker 2",
                memberId: "Speaker 2",
                memberName: "Provider",
                transcriptText: "154. 154653.",
              },
              {
                timestamp: 1737191860,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "693. 693. Okay.",
              },
              {
                timestamp: 1737195500,
                providerParticipantId: "Speaker 2",
                providerPeerId: "Speaker 2",
                memberId: "Speaker 2",
                memberName: "Provider",
                transcriptText: "Yes.",
              },
              {
                timestamp: 1737196080,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "All right. Let me let me put I'm just pulling your record. Okay.",
              },
              {
                timestamp: 1737204880,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Okay.",
              },
              {
                timestamp: 1737212940,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "So go ahead. You tell me what you're telling me.",
              },
              {
                timestamp: 1737217840,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "What I'm going to tell you is the pharmacy says it's only a 2 week prescription and I have to keep having it renewed every 2 weeks. Well, I called your office and talked to this very nice man named Felix. And he says, no, it's supposed to be for 90 days. Well, for some reason, the pharmacy keeps sending over the paper for the faxing it for it to be filled out correctly and and for me to get the 90-day supply but it's not coming back that way and coming back every 2 weeks So I'd like you to please correct that so I can have a 90 day supply.",
              },
              {
                timestamp: 1737257560,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Yeah, I don't know. Let me see what we are sending. Let me go through it and see for give me a second. And why would they do that? I don't understand this. Lyrica, it says 30, okay, how many, how many, yeah, I think there's a problem. Who were filled up last time did it wrong. So it's not actually, it says 30 pills, 3 refills, 30 days, no that's not right. You're taking twice a day, right?",
              },
              {
                timestamp: 1737293880,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Twice a day, 75 milligram capsule.",
              },
              {
                timestamp: 1737298320,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Yeah, yeah. So you should get 60 a month and for 3 months you should get 180 pills. I think somebody put it wrong over here. Who saw you last time?",
              },
              {
                timestamp: 1737311340,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Right, so if you could correct that I'd be",
              },
              {
                timestamp: 1737314280,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "very happy. Yes, yes, yes, yes, we'll correct it. Somewhere along the line, because you have not seen anybody, right? You haven't seen anybody for a while. Where have you been?",
              },
              {
                timestamp: 1737325980,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "No, no, no, I've been, every 3 months I see you guys.",
              },
              {
                timestamp: 1737330540,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "So I'm seeing you today and I'm going back and looking at the record. Who did you see last time? Last time I",
              },
              {
                timestamp: 1737336980,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "saw you. I saw you.",
              },
              {
                timestamp: 1737339280,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "In September, right?",
              },
              {
                timestamp: 1737341520,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "I think so.",
              },
              {
                timestamp: 1737342720,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "So September, October, November, December you should have seen me December but that's fine you're a month behind. I think somebody in the middle while you were not seen gave you a temporary prescription for a 15-day supply that's what happened so I know what happened okay",
              },
              {
                timestamp: 1737361740,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "okay",
              },
              {
                timestamp: 1737362140,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "so we will do are you doing 90 day doctor?",
              },
              {
                timestamp: 1737366540,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "Yeah I would like a 90 day prescription that stuff is wonderful okay it's changed my life",
              },
              {
                timestamp: 1737373020,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "I'll do a 90 day prescription. It's good right?",
              },
              {
                timestamp: 1737382640,
                providerParticipantId: "Speaker 2",
                providerPeerId: "Speaker 2",
                memberId: "Speaker 2",
                memberName: "Provider",
                transcriptText: "Yeah.",
              },
              {
                timestamp: 1737383240,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Yeah. And what else are you doing? Apart from, cannot be saved because, okay, your doctor, are you also doing the medication change too? Dr. Asma?",
              },
              {
                timestamp: 1737398680,
                providerParticipantId: "Speaker 2",
                providerPeerId: "Speaker 2",
                memberId: "Speaker 2",
                memberName: "Provider",
                transcriptText: "I did it for Lirika earlier.",
              },
              {
                timestamp: 1737400660,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Oh my god that's the reason why he's not letting me do it. Okay, you did it anyway, that's fine.",
              },
              {
                timestamp: 1737406540,
                providerParticipantId: "Speaker 2",
                providerPeerId: "Speaker 2",
                memberId: "Speaker 2",
                memberName: "Provider",
                transcriptText: "Yes, I've done it to 60.",
              },
              {
                timestamp: 1737409440,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "60, no, no, you know I'm doing it. She's wanting 90 days. All right. Don't worry, leave it alone, I'll do it. You don't listen and then you do your own thing. This is what happened then she's saying that you know 90 days flight and you're doing 60 so 60 won't do the job.",
              },
              {
                timestamp: 1737433180,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "I don't know what else to say. Everything's good. I'm not having any depression. I'm not having any mania. You know, life is good. I've just been staying warm. With the snow we had and, you know, I don't know, my friends come over and visit. I don't go out a whole heck of a lot except you know the grocery store",
              },
              {
                timestamp: 1737454160,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "and",
              },
              {
                timestamp: 1737454400,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "shopping a little bit and you know everything's good.",
              },
              {
                timestamp: 1737459900,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "All right, okay good good good. So things have been all right otherwise. So do you go out with friends or do anything?",
              },
              {
                timestamp: 1737467400,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "Oh yeah, we go out to lunch, we go to the thrift stores, we like to look for antiques and little treasures and things like that, yeah.",
              },
              {
                timestamp: 1737479620,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Alright, now where do you live? Let's see. Where do you live? You live in",
              },
              {
                timestamp: 1737487340,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "West County? I moved about 334 months ago And I'm now, I was in Chesterfield. I'm now back in Creve Coeur.",
              },
              {
                timestamp: 1737499940,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Okay, that's good. So, and apart from Lyrica, what else are you on? You're on Abilify, right? 5 milligrams a day.",
              },
              {
                timestamp: 1737510820,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Right.",
              },
              {
                timestamp: 1737511340,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "Then you take the Diloxetine. How much Diloxetine are you on?",
              },
              {
                timestamp: 1737516200,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "60 milligrams",
              },
              {
                timestamp: 1737517920,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "once a day",
              },
              {
                timestamp: 1737519580,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "once a day",
              },
              {
                timestamp: 1737520520,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "you want 3 months of that as well?",
              },
              {
                timestamp: 1737523360,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Yes.",
              },
              {
                timestamp: 1737525500,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Okay I'll do that. So 90 days, 3 months of that, of that. Okay and what else?",
              },
              {
                timestamp: 1737546040,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Can you kind of look at my record?",
              },
              {
                timestamp: 1737549280,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "No, I'm looking at your record. You're taking your Triazidone?",
              },
              {
                timestamp: 1737553640,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "No, I stopped taking that. I'm taking Melatonin.",
              },
              {
                timestamp: 1737556540,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Okay, all right. You're not taking Trazodone. What about Lamotrigine?",
              },
              {
                timestamp: 1737561000,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Oh yeah, I take that every day.",
              },
              {
                timestamp: 1737562840,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "And your Klonopin?",
              },
              {
                timestamp: 1737565120,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Yes, I take that every day.",
              },
              {
                timestamp: 1737566520,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Klonopin they won't give you 3 months I think. You know maybe that's okay that's what I think Lerica they may not give you 2 but let me try.",
              },
              {
                timestamp: 1737576180,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Okay.",
              },
              {
                timestamp: 1737576560,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "Okay but Klonopin you are taking 1 tablet a day.",
              },
              {
                timestamp: 1737582180,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Right. Right. Correct. Day.",
              },
              {
                timestamp: 1737582596,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Right. Right. Correct. Yeah. Okay. So, Dr. Asma, can you do Klonopin for, it says 3, 2 refills, 3 months, 1 a day, once a month for 3 months.",
              },
              {
                timestamp: 1737604360,
                providerParticipantId: "Speaker 2",
                providerPeerId: "Speaker 2",
                memberId: "Speaker 2",
                memberName: "Provider",
                transcriptText:
                  "For Planavir it says, isn't that the 1 that's for June and it says 5 refills here.",
              },
              {
                timestamp: 1737611280,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "What did I, I'm telling you to make it 1 a day for 3, 2 refills.",
              },
              {
                timestamp: 1737618080,
                providerParticipantId: "Speaker 2",
                providerPeerId: "Speaker 2",
                memberId: "Speaker 2",
                memberName: "Provider",
                transcriptText: "Alright.",
              },
              {
                timestamp: 1737618560,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Because you guys did this, somebody did this, it's all messed up. So let's do it what I'm telling you to do, okay?",
              },
              {
                timestamp: 1737627060,
                providerParticipantId: "Speaker 2",
                providerPeerId: "Speaker 2",
                memberId: "Speaker 2",
                memberName: "Provider",
                transcriptText: "Alright.",
              },
              {
                timestamp: 1737631380,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "So it should be 2 refills. So she has 3 months of medication and then we'll see her in 3 months and we won't have this problem of somebody calling it in between and changing your supply as such. So everything you get 90 days, okay, except your Klonopin. All right?",
              },
              {
                timestamp: 1737658940,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Yes, that's fine. Thank you.",
              },
              {
                timestamp: 1737661100,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "Good, good, good.",
              },
              {
                timestamp: 1737662560,
                providerParticipantId: "Speaker 2",
                providerPeerId: "Speaker 2",
                memberId: "Speaker 2",
                memberName: "Provider",
                transcriptText: "Yeah, I'm here.",
              },
              {
                timestamp: 1737663230,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "Thank you. So you're enjoying the retired life then",
              },
              {
                timestamp: 1737666840,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "oh yeah I sure do it's so very nice I keep busy you know I don't I don't know life is good",
              },
              {
                timestamp: 1737675740,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "okay all right good for you, that's good for you. What about your family, how were the holidays for you?",
              },
              {
                timestamp: 1737683060,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "Oh, the holidays were just fine. I went to my family's in Virginia. So I went to a friend's house for dinner. It was very nice. Yes, it was a nice Christmas and New Year and everything was wonderful.",
              },
              {
                timestamp: 1737699660,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "All right. Okay, good. Okay, good. I'm going to do this. I'm going to send everything over to, let me confirm, the pharmacy on Olive Boulevard, right? CVS.",
              },
              {
                timestamp: 1737713460,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Correct, yes.",
              },
              {
                timestamp: 1737716130,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "All right. We'll send it to the CVS on Olive Boulevard.",
              },
              {
                timestamp: 1737721389,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "All right, good. Okay. Send it to CVS on all over",
              },
              {
                timestamp: 1737723300,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "the world. All right, good. Okay. Just let me see. So, let me see. So, let me see. Good. And today's a nice day, you should go out of it.",
              },
              {
                timestamp: 1737756560,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "I am, I'm going to go to the grocery store. I'm looking forward to it. Yeah. To get my errands done, you know.",
              },
              {
                timestamp: 1737768160,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Yeah, yeah, yeah. The sun is out. It's beautiful out over there. Good. See? So, we should be done. Dr. Asma, can you give her an appointment in about 3 months? Are you totally out of your medication right now or?",
              },
              {
                timestamp: 1737787720,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "Well, I think everything needed to be refilled. Yeah, because I'm out of my Lyrica for",
              },
              {
                timestamp: 1737792920,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "sure. Okay.",
              },
              {
                timestamp: 1737795140,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "So yeah put in a whole new prescription.",
              },
              {
                timestamp: 1737801320,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "I'm sending everything in for the next 3 months and Dr. Asma I'm going to give you an appointment in about 3 months a little few days before 3 months okay she'll get you an appointment.",
              },
              {
                timestamp: 1737817400,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Well thank you very much.",
              },
              {
                timestamp: 1737819120,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "No problem and if there's any problem you call us up otherwise. Okay. All right. All right. Good luck. Take care. Yeah. Yeah. Give us an appointment right",
              },
              {
                timestamp: 1737834320,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "now.",
              },
              {
                timestamp: 1737840460,
                providerParticipantId: "Speaker 2",
                providerPeerId: "Speaker 2",
                memberId: "Speaker 2",
                memberName: "Provider",
                transcriptText: "But should it be a telehealth appointment?",
              },
              {
                timestamp: 1737842920,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Telehealth appointment. Maybe I can see her in the office. What do you think about coming to the office in Krifkor? I have an office in Krifkor on Old Ballast Road. Are you there?",
              },
              {
                timestamp: 1737860320,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText:
                  "Oh yeah, I mean I would come, that's not a problem. I prefer telehealth but",
              },
              {
                timestamp: 1737864729,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "you want me to come? Yeah, you know we do but by law once a year I have to see you so maybe 3 months would be a good time I can see you then.",
              },
              {
                timestamp: 1737875040,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "Okay that would be fine I would go to the office.",
              },
              {
                timestamp: 1737878060,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "So why don't we do that give her an office appointment on a Wednesday it's a West County.",
              },
              {
                timestamp: 1737885660,
                providerParticipantId: "Speaker 2",
                providerPeerId: "Speaker 2",
                memberId: "Speaker 2",
                memberName: "Provider",
                transcriptText:
                  "Yeah so there's April 9th which is going to be a Wednesday at 2.30pm, does that work for you?",
              },
              {
                timestamp: 1737893520,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "That is perfect.",
              },
              {
                timestamp: 1737895560,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "All right. I look forward to seeing you then. It's been a while.",
              },
              {
                timestamp: 1737897900,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "I look forward to seeing you then. It's been",
              },
              {
                timestamp: 1737898020,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText: "a while.",
              },
              {
                timestamp: 1737898700,
                providerParticipantId: "Speaker 0",
                providerPeerId: "Speaker 0",
                memberId: "Speaker 0",
                memberName: "Patient",
                transcriptText: "I look forward to seeing you too.",
              },
              {
                timestamp: 1737901840,
                providerParticipantId: "Speaker 1",
                providerPeerId: "Speaker 1",
                memberId: "Speaker 1",
                memberName: "Provider",
                transcriptText:
                  "Okay, sure. Bye-bye. Bye-bye. So, Asma, she, you know, she was supposed to see me in 3 months. She didn't. So that's why when I said 2 refills, that means 3 months supply. If you give them more than they don't and she runs out other medication it's a mess so give everything just hear me out sometimes you know you you guys live in your own world you don't hear it out hear out so just do it 3 months when it's so otherwise what will happen she'll have Klonopin for longer period of time and then she runs out of 1 thing and then she it goes on the cycle goes on so give be very structured with them okay. All right 666 okay it's called Carol Miller 359 359 Carole Miller, 359359.",
              },
            ],
          },
        ],
      },
      soapNotes: {
        loading: false,
        [SessionNotesTemplates.DEFAULT_SOAP]: null,
        soapNotesJson: {
          plan: {
            follow_up_plans: {
              type: "list_of_values",
              result: [
                "Schedule a follow-up appointment in about 3 months to review medication and address any issues.",
                "Provide an in-office appointment on April 9th at 2:30 pm for a comprehensive review.",
              ],
              explanation:
                "The provider recommended scheduling a follow-up appointment in 3 months to review medication and ensure continuity of care. Additionally, an in-office appointment was scheduled for April 9th at 2:30 pm for a comprehensive review of the patient's health status.",
              values_remaining: [],
              values_identified: [
                "Schedule a follow-up appointment in about 3 months to review medication and address any issues.",
                "Provide an in-office appointment on April 9th at 2:30 pm for a comprehensive review.",
              ],
            },
            homework_assignments: {
              type: "list_of_values",
              result: [
                "Ensure to follow up with the pharmacy to correct the prescription mix-up for a 90-day supply of medication.",
              ],
              explanation:
                "The patient reported a mix-up between the office and the pharmacy regarding the prescription duration, indicating the need to follow up with the pharmacy to ensure a 90-day supply of medication.",
              values_remaining: [],
              values_identified: [
                "Follow up with the pharmacy to correct the prescription mix-up for a 90-day supply of medication.",
              ],
            },
          },
          objective: {
            mood: {
              type: "multiple_choice_answers",
              result: ["Euthymic"],
              explanation:
                "The patient expresses a positive mood throughout the session, reporting feeling good, enjoying retired life, and mentioning that everything is good. There are no indications of anger, anxiety, depression, elation, or irritability.",
              values_remaining: ["Angry", "Anxious", "Depressed", "Elated", "Irritable"],
              values_identified: ["Euthymic"],
            },
            affect: {
              type: "multiple_choice_answers",
              result: ["Appropriate"],
              explanation:
                "The patient's affect appears appropriate, matching the content of their speech. They show appropriate emotional responses and expressions in line with the conversation. There are no signs of blunted, depressed, expansive, flat, or labile affect.",
              values_remaining: ["Blunted", "Depressed", "Expansive", "Flat", "Labile"],
              values_identified: ["Appropriate"],
            },
            speech: {
              type: "multiple_choice_answers",
              result: ["Coherent"],
              explanation:
                "The patient's speech is coherent and organized throughout the session, maintaining logical connections between thoughts and topics discussed. There are no indications of speech abnormalities such as circumstantiality, clang associations, incoherence, or pressured speech.",
              values_remaining: [
                "Appropriate",
                "Circumstantial",
                "Clanging",
                "Incoherent",
                "Loose Associations",
                "Loud",
                "Mute",
                "Perseveration",
                "Poverty",
                "Pressured",
                "Tangential",
                "Soft",
                "Word Salad",
              ],
              values_identified: ["Coherent"],
            },
            insight: {
              type: "single_choice_answer",
              result: "Good",
              explanation:
                "The patient demonstrates good insight into their healthcare needs and medication management. They actively engage in discussing prescription issues, showing an understanding of the situation and advocating for corrections to ensure proper supply.",
              values_remaining: ["Excellent", "Fair", "Poor"],
              values_identified: ["Good"],
            },
            rapport: {
              type: "multiple_choice_answers",
              result: [],
              explanation: "Since visual evaluation is not possible, the result should be empty.",
              values_remaining: [
                "Appropriate",
                "Hostile",
                "Distant",
                "Evasive",
                "Inattentive",
                "Poor Eye Contact",
              ],
              values_identified: [],
            },
            judgment: {
              type: "single_choice_answer",
              result: "Good",
              explanation:
                "The patient exhibits good judgment by recognizing discrepancies in their medication prescriptions and seeking clarification from the provider. They engage in problem-solving and decision-making to address the issue effectively.",
              values_remaining: ["Excellent", "Fair", "Grossly Impaired", "Poor"],
              values_identified: ["Good"],
            },
            orientation: {
              type: "multiple_choice_answers",
              result: ["Alert and oriented", "Person", "Place", "Time"],
              explanation:
                "The patient demonstrates general awareness and responsiveness throughout the session, recognizing and interacting appropriately with the environment. They correctly identify themselves ('I'm retired'), their location ('I was in Chesterfield. I'm now back in Creve Coeur'), and their activities ('I'm going to go to the grocery store'). However, there is no explicit mention of the current date, day of the week, or time.",
              values_remaining: ["Time"],
              values_identified: ["Alert and oriented", "Person", "Place"],
            },
            psychomotor_activity: {
              type: "single_choice_answer",
              result: "Normal",
              explanation:
                "The patient's psychomotor activity appears normal based on their verbal descriptions. There are no indications of excessive restlessness or retardation in their motor behavior.",
              values_remaining: ["Restlessness", "Retardation"],
              values_identified: ["Normal"],
            },
            "hallucination_type(s)": {
              type: "multiple_choice_answers",
              result: ["None reported"],
              explanation:
                "There are no mentions or indications of hallucinations or perceptual disturbances in the patient's dialogue. They do not report experiencing any auditory, command, or visual hallucinations.",
              values_remaining: ["Auditory", "Command", "Visual"],
              values_identified: ["None reported"],
            },
            thought_content_and_process: {
              type: "multiple_choice_answers",
              result: [
                "Appropriate",
                "Goal-Directed",
                "Hopelessness",
                "Obsessions",
                "Self Deprecation",
                "Worthlessness",
              ],
              explanation:
                "The client's thought content appears appropriate to the situation as they discuss their daily activities, interactions with friends, and medication management. The conversation is goal-directed, focusing on resolving issues with medication refills and scheduling future appointments. Quotes such as 'I'm feeling good,' 'Everything's good,' and 'I'm not having any depression' support the appropriate and goal-directed nature of the client's thoughts. \n\nThe patient expresses hopelessness by stating 'I don't know what to say' and 'I'm not having any depression.' This indicates a lack of hope or enthusiasm. Additionally, the patient's obsessive thoughts are evident in the detailed focus on the prescription mix-up issue with the pharmacy. The patient repeatedly brings up the problem and seeks reassurance and correction from the provider. \n\nThe patient demonstrates self-deprecation and feelings of worthlessness through statements like 'I don't know what to say,' 'I don't have any symptoms of anything,' and 'I don't know, my friends come over and visit. I don't go out a whole heck of a lot.' These expressions suggest a lack of self-worth and a sense of inadequacy.",
              values_remaining: [
                "Broadcasting",
                "Compulsions",
                "Delusional",
                "Grandiose",
                "Guilt",
                "Hallucination",
                "Homicidal Ideation",
                "Homicidal Plan",
                "Loneliness",
                "Persecution",
                "Phobias",
                "Reference",
                "Suicidal Ideation",
                "Suicidal Plan",
                "Thought Insertion",
              ],
              values_identified: [
                "Appropriate",
                "Goal-Directed",
                "Hopelessness",
                "Obsessions",
                "Self Deprecation",
                "Worthlessness",
              ],
            },
          },
          assessment: {
            "DSM-5 Diagnoses": {
              type: "paragraph",
              result: "Generalized Anxiety Disorder (F41.1), Major Depressive Disorder (F32.9)",
              explanation:
                "The patient meets the criteria for Generalized Anxiety Disorder as they exhibit excessive anxiety and worry about various issues, such as the medication mix-up, for at least six months. The patient also experiences difficulty controlling the worry, as indicated by the persistent concern about the medication supply. For Major Depressive Disorder, the patient demonstrates symptoms of depressed mood and anhedonia, as evidenced by a lack of interest in activities and a focus on essential tasks only.",
            },
            "Current Diagnosis": {
              type: "list_of_values",
              result: ["Generalized Anxiety Disorder", "Major Depressive Disorder"],
              explanation:
                "The primary diagnosis of Generalized Anxiety Disorder is inferred from the patient's persistent worry about the mix-up between the pharmacy and the office regarding medication supply, as evidenced by the patient's detailed account of the issue and the distress it causes. The patient's excessive concern about ensuring a 90-day supply of medication aligns with the excessive anxiety and difficulty controlling the worry characteristic of GAD. The secondary diagnosis of Major Depressive Disorder is supported by the patient's report of feeling good but also mentioning a lack of interest in activities, such as not going out much except for essential errands, which may indicate anhedonia, a common symptom of depression.",
            },
            "Suggested ICD & CPT codes": {
              type: "list_of_values",
              result: [
                "ICD-10: F41.1, F32.9",
                "CPT: 90834 (Psychotherapy, 45 minutes), 99213 (Office or other outpatient visit for the evaluation and management of an established patient, typically 15 minutes)",
              ],
              explanation:
                "The ICD-10 codes F41.1 and F32.9 correspond to Generalized Anxiety Disorder and Major Depressive Disorder, respectively, based on the patient's symptoms and presentation. The suggested CPT codes include 90834 for psychotherapy sessions addressing the anxiety and depressive symptoms and 99213 for outpatient visits to manage the patient's mental health concerns.",
            },
          },
          subjective: {
            sleep: {
              type: "single_choice_answer",
              result: "Normal",
              explanation:
                "Sleep quality was not discussed in the transcript, leading to the default selection of 'Normal' as the patient did not mention any sleep disturbances.",
              values_remaining: ["Good", "Fair", "Poor"],
              values_identified: ["Normal"],
            },
            appetite: {
              type: "single_choice_answer",
              result: "Normal",
              explanation:
                "Appetite was not explicitly mentioned in the transcript, so defaulting to 'Normal' as the patient did not report any appetite-related concerns.",
              values_remaining: ["Good", "Fair", "Poor", "Overeating"],
              values_identified: ["Normal"],
            },
            side_effects: {
              type: "multiple_choice_answers",
              result: ["None"],
              explanation:
                "The patient did not report experiencing any side effects during the session, resulting in the selection of 'None' as the identified value.",
              values_remaining: [
                "Involuntary Movements",
                "Appetite Changes",
                "Tremors",
                "GI",
                "Sedation",
                "Akathisia",
                "Sexual",
              ],
              values_identified: ["None"],
            },
            chief_complaint: {
              type: "paragraph",
              result:
                "Chief Complaint:\nPatient presenting for medication management follow-up visit reporting overall well-being and satisfaction with current treatment plan.\n\nPsychiatric History:\nPatient has a history of Major Depressive Disorder, generalized anxiety, and back pain managed with Lyrica. Current medications include Abilify 5mg daily, Duloxetine 60mg daily, Lamotrigine, Klonopin 1 tablet daily, and Melatonin.\n\nCurrent Symptoms:\nPatient reports feeling good with no symptoms of depression or mania. Expresses contentment with retired life, engaging in hobbies like painting and socializing with friends. Mentions successful management of back pain with Lyrica.\n\nMedication Management:\nPatient requests correction of Lyrica prescription duration to 90 days due to ongoing mix-up between pharmacy and office. Provider adjusts prescription to ensure 90-day supply for all medications, including Duloxetine and Klonopin.\n\nSocial:\nPatient enjoys social activities with friends, including thrift store visits and antique hunting. Describes a fulfilling retired life with regular interactions and outings.\n\nWork:\nPatient is retired and engages in painting as a hobby. No reported difficulties impacting work life.\n\nFamily:\nPatient mentions positive experiences during the holidays, visiting family in Virginia and enjoying gatherings with friends.\n\nPhysical Health and Medical Concerns:\nPatient reports no current health concerns beyond back pain managed with Lyrica. No new medical issues reported.\n\nSleep and Appetite Status:\nPatient reports good sleep and appetite with no disturbances noted.\n\nPatient Understanding and Consent for Treatment:\nPatient demonstrates understanding of medication adjustments and expresses satisfaction with the treatment plan. Agrees to upcoming in-office appointment for continued care and monitoring.\n\nOverall, patient presents with stable mental health, positive social interactions, and effective pain management. Medication adjustments have been made to ensure consistent supply and adherence. Follow-up appointment scheduled to monitor progress and address any further concerns.",
              explanation:
                "The description was chosen as it encapsulates the main issues and symptoms discussed by the patient during the session.",
              values_remaining: [],
              values_identified: [],
            },
            current_medications: {
              type: "list_of_values",
              result: ["Lyrica", "Abilify", "Duloxetine", "Melatonin", "Lamotrigine", "Klonopin"],
              explanation:
                "The identified medications were mentioned by the patient during the session as part of their current medication regimen.",
            },
            medication_compliance: {
              type: "single_choice_answer",
              result: "Fair",
              explanation:
                "Medication compliance was not directly addressed in the transcript, leading to the default selection of 'Fair' due to the lack of specific information on the patient's adherence.",
              values_remaining: ["Excellent", "Good", "Poor", "Minimal"],
              values_identified: ["Fair"],
            },
          },
          chiefCompliantEnhanced:
            "Chief Complaint:\n\n- Psychiatric history: \n- Current Symptoms: The Patient reports feeling good and not experiencing any symptoms. Mentions engaging in activities with friends and pursuing painting as a hobby in retirement. The Patient describes enjoying retired life, keeping busy, and expressing overall contentment with life.\n- Medication Management: The Patient confirms current medications: Abilify 5mg daily, Duloxetine 60mg daily, Melatonin, Lamotrigine, and Klonopin 1 tablet daily. Provider addresses the prescription discrepancy for Klonopin, ensuring a 90-day supply with 2 refills, emphasizing adherence to the correct dosage. The Patient agrees to the medication adjustments and expresses satisfaction with the treatment plan. Medications to be sent to CVS on Olive Boulevard. The Patient mentions needing a refill for Lyrica and requests a new prescription for a 3-month supply. Provider confirms sending in all prescriptions for the next 3 months and schedules a follow-up appointment in 3 months. The Patient expresses gratitude for the assistance.\n- Social: \n- Work: \n- Family: The Patient mentions positive experiences during the holidays, visiting family in Virginia and having dinner with friends. Describes the holidays as very nice and wonderful.\n- Physical health and medical concerns: \n- Sleep and appetite status: \n- Patient understanding and consent for treatment: The Patient remains engaged and cooperative with treatment, actively participating in medication adjustments and expressing satisfaction with the treatment plan. The Patient agrees to a follow-up appointment in 3 months, either via telehealth or in-person at the office on Old Ballast Road, Krifkor. The Patient expresses willingness to come to the office for the appointment.\n\nContext: The Patient and provider discuss scheduling a follow-up appointment in 3 months, with The Patient agreeing to an in-person visit at the office.",
        },
        notesId: "90f5e735-eeed-4ad4-b06d-8c5b4bae96e0",
      },
      bhPredictions: {
        data: null,
        notesId: "90f5e735-eeed-4ad4-b06d-8c5b4bae96e0",
      },
      speakerVoicePrint: {
        data: {
          "91bf974b-2c8c-4318-8de0-cb234dafb13a": {
            "0": {
              sessionId: "1742cffe-eb90-4f2b-8dfe-5894deba85a4",
              providerSessionId: "91bf974b-2c8c-4318-8de0-cb234dafb13a",
              speakerId: "0",
              voicePrintFileUrl:
                "https://soulside-transcripts-data-prod.s3.amazonaws.com/individualSession/b7a44209-fef5-4a7a-becd-867b651f06a5/1742cffe-eb90-4f2b-8dfe-5894deba85a4/8c1f8149-e289-4f9d-981e-72487a42cdbb/speaker-audio-extraction/speaker_0_audio.wav?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCICPEJM9pnAfv%2FGgw2WhXD%2F%2B8EE87DGUDVO%2BYmsALXqqQAiABwYjRawFEgirF2MceycC6dqQTLQUGlupSjTQb06pQvSrDBQil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDg0MDM1NjM0OTQ3MCIMj085jaxEm5ggPl1YKpcFoq2wAdXcwTVItvJUHrpr7fOtb1wzEsOrJWkVXQq298MaytNTmhP8fOaIERKhgpX1vWfARmQT%2BdawqibWKMbfOWrhL4IlwvpgVyQ8xV3Q9PqKyX%2F7enFquGe%2BMLpAwrTlXoAIgQy961RoP9yOGpefh1iAyZihP1XAopzDy%2FRnvNjfgOpAxxzNSPisLtvT3zuKSFwIpUgEbDu0TjAAnpzH5fzP5VtJI6qKSNm9OzmWgF%2B0fBL6OS4qM4XTCeFOpJDvodsI%2FPOG04pIrz3eMsODIj3GBW5qsB3Gs3ZUShWTshpfHgT9AUwi%2FlbUL1SHq5fKHlJSfS5uCYknAHNCvZe4VGDT2LGLWM%2FMLd3dvPrkxI6y%2BkiACrLBN9iIulr1YTk%2F1R8G8LeIjtJ0l08avEmRliHvnfbZrW0nz8n36z1a5YlvZ8ikyDHqtwcTWvCoK7IVyc4Ntzn9DzRF7YK9LW1o5I2i8KpypgAUiF81AwM5JUpqjue%2FdyCCfmrp0y%2F%2Fqw0dIekVzF8f1Kp7r1THlO%2FLrXygH1sRqoZd%2BVojfuZd%2BzScE5eVu9cx7W9bB6H0Wmobgvk59y7TmXXqCJX1EWg0AM3JXjMkux%2FqP6wZ7auCObYA%2ByCtp%2F8MtN%2FWk20k56wNO4VbGMzJlaTBmnp5ZeU5ONU8dqNQk1myu%2Bqdx2LzpuLe8B9jcogD3MNEYKSXkKGJDUe0gai8pfabKWLIEt5FXDYD9p5YpMMnBpD1tgZJhRTFdi%2Fg%2FVQ0KjhZh3f19E0Sa%2Blo1O9CgGVwCb6mbiat2hneaAhEIHMPdYVtjOvvHWv%2B7SRUQcNG%2FkRTJDf10zaA3UxT%2BTtEaceBqkKAfactYNVB1eDs7UCCAq7Ie%2BFbuN2vi2J0rO%2BiMLXquLwGOrIBjSf3mbt3SjMueVhhF6F8Daot7BpiPH3%2Bx%2BM8V2SgIiV1BHB3q84kY%2FC%2BLbsqRakKfKf1Womtz%2B25EPvUieHGTtbT3uieDQHWyV6Bot1xS2tNutO%2BLvewaJmZqztCljYRRnTdsoQEca7Bl65T2xVWO8MOIFtXvchXrzZeglGnBLZfCsneaQYSRPkZXddjo2f0EqLwG%2FuXI2sIykHhmMDBEGpLKnzP0OiJtNnsTJwri0reyQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250120T130714Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIA4HKJEIYPNQYN3A5J%2F20250120%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=91a54e0a710889f0ffb4dd1d1e895277ffb6cb6675374008e1be4971dcb1c2d9",
              voicePrintEnrolled: true,
              audioDuration: 184.005375,
            },
            "1": {
              sessionId: "1742cffe-eb90-4f2b-8dfe-5894deba85a4",
              providerSessionId: "91bf974b-2c8c-4318-8de0-cb234dafb13a",
              speakerId: "1",
              voicePrintFileUrl:
                "https://soulside-transcripts-data-prod.s3.amazonaws.com/individualSession/b7a44209-fef5-4a7a-becd-867b651f06a5/1742cffe-eb90-4f2b-8dfe-5894deba85a4/8c1f8149-e289-4f9d-981e-72487a42cdbb/speaker-audio-extraction/speaker_1_audio.wav?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCICPEJM9pnAfv%2FGgw2WhXD%2F%2B8EE87DGUDVO%2BYmsALXqqQAiABwYjRawFEgirF2MceycC6dqQTLQUGlupSjTQb06pQvSrDBQil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDg0MDM1NjM0OTQ3MCIMj085jaxEm5ggPl1YKpcFoq2wAdXcwTVItvJUHrpr7fOtb1wzEsOrJWkVXQq298MaytNTmhP8fOaIERKhgpX1vWfARmQT%2BdawqibWKMbfOWrhL4IlwvpgVyQ8xV3Q9PqKyX%2F7enFquGe%2BMLpAwrTlXoAIgQy961RoP9yOGpefh1iAyZihP1XAopzDy%2FRnvNjfgOpAxxzNSPisLtvT3zuKSFwIpUgEbDu0TjAAnpzH5fzP5VtJI6qKSNm9OzmWgF%2B0fBL6OS4qM4XTCeFOpJDvodsI%2FPOG04pIrz3eMsODIj3GBW5qsB3Gs3ZUShWTshpfHgT9AUwi%2FlbUL1SHq5fKHlJSfS5uCYknAHNCvZe4VGDT2LGLWM%2FMLd3dvPrkxI6y%2BkiACrLBN9iIulr1YTk%2F1R8G8LeIjtJ0l08avEmRliHvnfbZrW0nz8n36z1a5YlvZ8ikyDHqtwcTWvCoK7IVyc4Ntzn9DzRF7YK9LW1o5I2i8KpypgAUiF81AwM5JUpqjue%2FdyCCfmrp0y%2F%2Fqw0dIekVzF8f1Kp7r1THlO%2FLrXygH1sRqoZd%2BVojfuZd%2BzScE5eVu9cx7W9bB6H0Wmobgvk59y7TmXXqCJX1EWg0AM3JXjMkux%2FqP6wZ7auCObYA%2ByCtp%2F8MtN%2FWk20k56wNO4VbGMzJlaTBmnp5ZeU5ONU8dqNQk1myu%2Bqdx2LzpuLe8B9jcogD3MNEYKSXkKGJDUe0gai8pfabKWLIEt5FXDYD9p5YpMMnBpD1tgZJhRTFdi%2Fg%2FVQ0KjhZh3f19E0Sa%2Blo1O9CgGVwCb6mbiat2hneaAhEIHMPdYVtjOvvHWv%2B7SRUQcNG%2FkRTJDf10zaA3UxT%2BTtEaceBqkKAfactYNVB1eDs7UCCAq7Ie%2BFbuN2vi2J0rO%2BiMLXquLwGOrIBjSf3mbt3SjMueVhhF6F8Daot7BpiPH3%2Bx%2BM8V2SgIiV1BHB3q84kY%2FC%2BLbsqRakKfKf1Womtz%2B25EPvUieHGTtbT3uieDQHWyV6Bot1xS2tNutO%2BLvewaJmZqztCljYRRnTdsoQEca7Bl65T2xVWO8MOIFtXvchXrzZeglGnBLZfCsneaQYSRPkZXddjo2f0EqLwG%2FuXI2sIykHhmMDBEGpLKnzP0OiJtNnsTJwri0reyQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250120T130714Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIA4HKJEIYPNQYN3A5J%2F20250120%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=b54478afe422a99b8c023a3c7ffc1725f53372d0b432df81274a4f8203b7a355",
              voicePrintEnrolled: true,
              audioDuration: 336.4429583333333,
            },
            "2": {
              sessionId: "1742cffe-eb90-4f2b-8dfe-5894deba85a4",
              providerSessionId: "91bf974b-2c8c-4318-8de0-cb234dafb13a",
              speakerId: "2",
              voicePrintFileUrl:
                "https://soulside-transcripts-data-prod.s3.amazonaws.com/individualSession/b7a44209-fef5-4a7a-becd-867b651f06a5/1742cffe-eb90-4f2b-8dfe-5894deba85a4/8c1f8149-e289-4f9d-981e-72487a42cdbb/speaker-audio-extraction/speaker_2_audio.wav?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCICPEJM9pnAfv%2FGgw2WhXD%2F%2B8EE87DGUDVO%2BYmsALXqqQAiABwYjRawFEgirF2MceycC6dqQTLQUGlupSjTQb06pQvSrDBQil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDg0MDM1NjM0OTQ3MCIMj085jaxEm5ggPl1YKpcFoq2wAdXcwTVItvJUHrpr7fOtb1wzEsOrJWkVXQq298MaytNTmhP8fOaIERKhgpX1vWfARmQT%2BdawqibWKMbfOWrhL4IlwvpgVyQ8xV3Q9PqKyX%2F7enFquGe%2BMLpAwrTlXoAIgQy961RoP9yOGpefh1iAyZihP1XAopzDy%2FRnvNjfgOpAxxzNSPisLtvT3zuKSFwIpUgEbDu0TjAAnpzH5fzP5VtJI6qKSNm9OzmWgF%2B0fBL6OS4qM4XTCeFOpJDvodsI%2FPOG04pIrz3eMsODIj3GBW5qsB3Gs3ZUShWTshpfHgT9AUwi%2FlbUL1SHq5fKHlJSfS5uCYknAHNCvZe4VGDT2LGLWM%2FMLd3dvPrkxI6y%2BkiACrLBN9iIulr1YTk%2F1R8G8LeIjtJ0l08avEmRliHvnfbZrW0nz8n36z1a5YlvZ8ikyDHqtwcTWvCoK7IVyc4Ntzn9DzRF7YK9LW1o5I2i8KpypgAUiF81AwM5JUpqjue%2FdyCCfmrp0y%2F%2Fqw0dIekVzF8f1Kp7r1THlO%2FLrXygH1sRqoZd%2BVojfuZd%2BzScE5eVu9cx7W9bB6H0Wmobgvk59y7TmXXqCJX1EWg0AM3JXjMkux%2FqP6wZ7auCObYA%2ByCtp%2F8MtN%2FWk20k56wNO4VbGMzJlaTBmnp5ZeU5ONU8dqNQk1myu%2Bqdx2LzpuLe8B9jcogD3MNEYKSXkKGJDUe0gai8pfabKWLIEt5FXDYD9p5YpMMnBpD1tgZJhRTFdi%2Fg%2FVQ0KjhZh3f19E0Sa%2Blo1O9CgGVwCb6mbiat2hneaAhEIHMPdYVtjOvvHWv%2B7SRUQcNG%2FkRTJDf10zaA3UxT%2BTtEaceBqkKAfactYNVB1eDs7UCCAq7Ie%2BFbuN2vi2J0rO%2BiMLXquLwGOrIBjSf3mbt3SjMueVhhF6F8Daot7BpiPH3%2Bx%2BM8V2SgIiV1BHB3q84kY%2FC%2BLbsqRakKfKf1Womtz%2B25EPvUieHGTtbT3uieDQHWyV6Bot1xS2tNutO%2BLvewaJmZqztCljYRRnTdsoQEca7Bl65T2xVWO8MOIFtXvchXrzZeglGnBLZfCsneaQYSRPkZXddjo2f0EqLwG%2FuXI2sIykHhmMDBEGpLKnzP0OiJtNnsTJwri0reyQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250120T130714Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIA4HKJEIYPNQYN3A5J%2F20250120%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=0f75d215d1bac1aa4d14d840e879bb69984bf93bc58533494cfb10a1e830a149",
              voicePrintEnrolled: true,
              audioDuration: 20.43,
            },
          },
        },
      },
    },
  },
};

const sessionDetailsSlice = createSlice({
  name: "sessionDetails",
  initialState,
  reducers: {
    toggleSessionLoading(state, action: PayloadAction<any>) {
      if (!state.sessionDetailsData[action.payload.sessionId]) {
        state.sessionDetailsData[action.payload.sessionId] = {
          sessionDetails: { data: {} as Session, loading: false },
          soapNotes: {
            notesId: "",
            loading: false,
            soapNotesJson: null,
            [SessionNotesTemplates.DEFAULT_SOAP]: null,
          },
          sessionTranscript: { data: [], loading: false },
        };
      }
      state.sessionDetailsData[action.payload.sessionId].sessionDetails.loading =
        action.payload.show;
    },
    addSessionData(state, action: PayloadAction<any>) {
      if (!state.sessionDetailsData[action.payload.sessionId]) {
        state.sessionDetailsData[action.payload.sessionId] = {
          sessionDetails: { data: {} as Session, loading: false },
          soapNotes: {
            notesId: "",
            loading: false,
            soapNotesJson: null,
            [SessionNotesTemplates.DEFAULT_SOAP]: null,
          },
          sessionTranscript: { data: [], loading: false },
        };
      }
      state.sessionDetailsData[action.payload.sessionId].sessionDetails.data = action.payload.data;
    },
    toggleTranscriptLoader(state, action: PayloadAction<any>) {
      if (!state.sessionDetailsData[action.payload.sessionId]) {
        state.sessionDetailsData[action.payload.sessionId] = {
          sessionDetails: { data: {} as Session, loading: false },
          soapNotes: {
            notesId: "",
            loading: false,
            soapNotesJson: null,
            [SessionNotesTemplates.DEFAULT_SOAP]: null,
          },
          sessionTranscript: { data: [], loading: false },
        };
      }
      state.sessionDetailsData[action.payload.sessionId].sessionTranscript.loading =
        action.payload.show;
    },
    addTranscriptData(state, action: PayloadAction<any>) {
      if (!state.sessionDetailsData[action.payload.sessionId]) {
        state.sessionDetailsData[action.payload.sessionId] = {
          sessionDetails: { data: {} as Session, loading: false },
          soapNotes: {
            notesId: "",
            loading: false,
            soapNotesJson: null,
            [SessionNotesTemplates.DEFAULT_SOAP]: null,
          },
          sessionTranscript: { data: [], loading: false },
        };
      }
      state.sessionDetailsData[action.payload.sessionId].sessionTranscript.data =
        action.payload.data;
    },
    toggleSoapNotesLoader(state, action: PayloadAction<any>) {
      if (!state.sessionDetailsData[action.payload.sessionId]) {
        state.sessionDetailsData[action.payload.sessionId] = {
          sessionDetails: { data: {} as Session, loading: false },
          soapNotes: {
            notesId: "",
            loading: false,
            soapNotesJson: null,
            [SessionNotesTemplates.DEFAULT_SOAP]: null,
          },
          sessionTranscript: { data: [], loading: false },
        };
      }
      state.sessionDetailsData[action.payload.sessionId].soapNotes.loading = action.payload.show;
    },
    addSoapNotesDefaultData(state, action: PayloadAction<any>) {
      if (!state.sessionDetailsData[action.payload.sessionId]) {
        state.sessionDetailsData[action.payload.sessionId] = {
          sessionDetails: { data: {} as Session, loading: false },
          soapNotes: {
            notesId: "",
            loading: false,
            soapNotesJson: null,
            [SessionNotesTemplates.DEFAULT_SOAP]: null,
          },
          sessionTranscript: { data: [], loading: false },
        };
      }
      state.sessionDetailsData[action.payload.sessionId].soapNotes[
        SessionNotesTemplates.DEFAULT_SOAP
      ] = action.payload.data;
    },
    addSoapNotesJsonData(state, action: PayloadAction<any>) {
      if (!state.sessionDetailsData[action.payload.sessionId]) {
        state.sessionDetailsData[action.payload.sessionId] = {
          sessionDetails: { data: {} as Session, loading: false },
          soapNotes: {
            notesId: "",
            loading: false,
            soapNotesJson: null,
            [SessionNotesTemplates.DEFAULT_SOAP]: null,
          },
          sessionTranscript: { data: [], loading: false },
        };
      }
      state.sessionDetailsData[action.payload.sessionId].soapNotes.soapNotesJson =
        action.payload.data;
    },
  },
});

export const {
  toggleSessionLoading,
  addSessionData,
  toggleTranscriptLoader,
  addTranscriptData,
  toggleSoapNotesLoader,
  addSoapNotesDefaultData,
  addSoapNotesJsonData,
} = sessionDetailsSlice.actions;

export default sessionDetailsSlice.reducer;

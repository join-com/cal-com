import type { Prisma } from "@prisma/client";
import { PeriodType, SchedulingType } from "@prisma/client";

import { DailyLocationType } from "@calcom/app-store/locations";
import { getBookingFieldsWithSystemFields } from "@calcom/features/bookings/lib/getBookingFields";
import type { userSelect } from "@calcom/prisma/selects";
import type { CustomInputSchema } from "@calcom/prisma/zod-utils";
import { EventTypeMetaDataSchema } from "@calcom/prisma/zod-utils";

type User = Prisma.UserGetPayload<typeof userSelect>;

type UsernameSlugLinkProps = {
  users: {
    id?: number;
    username: string | null;
    email?: string;
    name?: string | null;
    bio?: string | null;
    avatar?: string | null;
    theme?: string | null;
    away?: boolean;
    verified?: boolean | null;
    allowDynamicBooking?: boolean | null;
  }[];
  slug: string;
};

const user: User = {
  metadata: null,
  theme: null,
  credentials: [],
  username: "john.doe",
  timeZone: "",
  bufferTime: 0,
  availability: [],
  id: 0,
  startTime: 0,
  endTime: 0,
  selectedCalendars: [],
  schedules: [],
  defaultScheduleId: null,
  locale: "en",
  email: "john.doe@example.com",
  name: "John doe",
  avatar: "",
  destinationCalendar: null,
  hideBranding: true,
  brandColor: "#797979",
  darkBrandColor: "#efefef",
  allowDynamicBooking: true,
  timeFormat: 12,
};

const customInputs: CustomInputSchema[] = [];

export const defaultEventSettings = {
  disableGuests: true,
  periodCountCalendarDays: true,
  periodDays: 30,
  periodType: PeriodType.ROLLING,
};

const commons = {
  isDynamic: true,
  periodStartDate: null,
  periodEndDate: null,
  beforeEventBuffer: 0,
  afterEventBuffer: 0,
  slotInterval: null,
  locations: [{ type: DailyLocationType }],
  customInputs,
  minimumBookingNotice: 120,
  schedule: null,
  timeZone: null,
  successRedirectUrl: "",
  teamId: null,
  scheduleId: null,
  availability: [],
  price: 0,
  currency: "usd",
  schedulingType: SchedulingType.COLLECTIVE,
  seatsPerTimeSlot: null,
  seatsShowAttendees: null,
  id: 0,
  hideCalendarNotes: false,
  recurringEvent: null,
  destinationCalendar: null,
  team: null,
  requiresConfirmation: false,
  bookingLimits: null,
  durationLimits: null,
  hidden: false,
  userId: 0,
  owner: null,
  workflows: [],
  users: [user],
  hosts: [],
  metadata: EventTypeMetaDataSchema.parse({}),
  bookingFields: getBookingFieldsWithSystemFields({
    bookingFields: [],
    customInputs: [],
    // Default value of disableGuests from DB.
    disableGuests: false,
    metadata: {},
    workflows: [],
  }),
  ...defaultEventSettings,
};

const screeningCall = {
  length: 30,
  slug: "30",
  title: "Screening Call",
  eventName: "Screening Call 30min Event",
  description: "Screening Call 30min Event",
  descriptionAsSafeHTML: "Screening Call 30min Event",
  position: 0,
  ...commons,
};
const culturalFitInterview = {
  length: 60,
  slug: "60",
  title: "Cultural Fit Interview",
  eventName: "Cultural Fit Interview 1hr Event",
  description: "Cultural Fit Interview 1hr Event",
  descriptionAsSafeHTML: "Cultural Fit Interview 1hr Event",
  position: 1,
  ...commons,
};
const technicalCall = {
  length: 120,
  slug: "tech",
  title: "Technical Call",
  eventName: "Technical Call 2hr Event",
  description: "Technical Call 2hr Event",
  descriptionAsSafeHTML: "Technical Call 2hr Event",
  position: 2,
  ...commons,
};
const caseStudyCall = {
  length: 120,
  slug: "120",
  title: "Case Study Call",
  eventName: "Case Study Call 2hr Event",
  description: "Case Study Call 2hr Event",
  descriptionAsSafeHTML: "Case Study Call 2hr Event",
  position: 3,
  ...commons,
};
const hiringManagerInterview = {
  length: 60,
  slug: "hiring-manager",
  title: "Hiring Manager Interview",
  eventName: "Hiring Manager Interview 1hr Event",
  description: "Hiring Manager Interview 1hr Event",
  descriptionAsSafeHTML: "Hiring Manager Interview 1hr Event",
  position: 4,
  ...commons,
};
const founderInterview = {
  length: 45,
  slug: "45",
  title: "Founder Interview",
  eventName: "Founder Interview 45min Event",
  description: "Founder Interview 45min Event",
  descriptionAsSafeHTML: "Founder Interview 45min Event",
  position: 5,
  ...commons,
};

const defaultEvents = [
  screeningCall,
  culturalFitInterview,
  technicalCall,
  caseStudyCall,
  hiringManagerInterview,
  founderInterview,
];

export const getDynamicEventDescription = (dynamicUsernames: string[], slug: string): string => {
  return `Book a ${slug} min event with ${dynamicUsernames.join(", ")}`;
};

export const getDynamicEventName = (dynamicNames: string[], slug: string): string => {
  const lastUser = dynamicNames.pop();
  return `Dynamic Collective ${slug} min event with ${dynamicNames.join(", ")} & ${lastUser}`;
};

export const getDefaultEvent = (slug: string) => {
  const event = defaultEvents.find((obj) => {
    return obj.slug === slug;
  });
  return event || screeningCall;
};

export const getGroupName = (usernameList: string[]): string => {
  return usernameList.join(", ");
};

export const getUsernameSlugLink = ({ users, slug }: UsernameSlugLinkProps): string => {
  let slugLink = ``;
  if (users.length > 1) {
    const combinedUsername = users.map((user) => user.username).join("+");
    slugLink = `/${combinedUsername}/${slug}`;
  } else {
    slugLink = `/${users[0].username}/${slug}`;
  }
  return slugLink;
};

const arrayCast = (value: unknown | unknown[]) => {
  return Array.isArray(value) ? value : value ? [value] : [];
};

export const getUsernameList = (users: string | string[] | undefined): string[] => {
  // Multiple users can come in case of a team round-robin booking and in that case dynamic link won't be a user.
  // So, even though this code handles even if individual user is dynamic link, that isn't a possibility right now.
  users = arrayCast(users);

  const allUsers = users.map((user) =>
    user
      .toLowerCase()
      .replace(/( |%20)/g, "+")
      .split("+")
  );

  return Array.prototype.concat(...allUsers);
};

export default defaultEvents;

import { useCallback, useEffect, useState } from "react";
import type {
  CalendarEvent,
  ManagedEvent,
  ProjectProposal,
  StrategySubmission,
} from "../types";
import type { UserProfile, Visibility, WorkItemRecord } from "../types/auth";
import {
  listVisibleWork,
  softDeleteWork,
  updateVisibility,
  upsertWorkItem,
} from "../lib/localAuth";

export interface OwnedSubmission extends StrategySubmission {
  workId: string;
  visibility: Visibility;
  sharedWithUserIds: string[];
  ownerId: string;
  ownerName: string;
  canEdit: boolean;
}

export interface OwnedProposal extends ProjectProposal {
  workId: string;
  visibility: Visibility;
  sharedWithUserIds: string[];
  ownerId: string;
  ownerName: string;
  canEdit: boolean;
}

export interface OwnedManagedEvent extends ManagedEvent {
  workId: string;
  visibility: Visibility;
  sharedWithUserIds: string[];
  ownerId: string;
  ownerName: string;
  canEdit: boolean;
}

export interface OwnedCalendarEvent extends CalendarEvent {
  workId: string;
  visibility: Visibility;
  sharedWithUserIds: string[];
  ownerId: string;
  ownerName: string;
  canEdit: boolean;
}

function mapSubmission(item: WorkItemRecord, user: UserProfile): OwnedSubmission {
  const payload = item.payload as StrategySubmission;
  return {
    ...payload,
    id: payload.id || item.id,
    workId: item.id,
    visibility: item.visibility,
    sharedWithUserIds: item.sharedWithUserIds,
    ownerId: item.ownerId,
    ownerName: item.ownerName,
    canEdit: item.ownerId === user.id,
  };
}

export function useUserWork(user: UserProfile | null) {
  const [submissions, setSubmissions] = useState<OwnedSubmission[]>([]);
  const [proposals, setProposals] = useState<OwnedProposal[]>([]);
  const [managedEvents, setManagedEvents] = useState<OwnedManagedEvent[]>([]);
  const [events, setEvents] = useState<OwnedCalendarEvent[]>([]);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!user) {
      setSubmissions([]);
      setProposals([]);
      setManagedEvents([]);
      setEvents([]);
      return;
    }
    setSubmissions(
      listVisibleWork<StrategySubmission>(user, "submission").map((i) =>
        mapSubmission(i, user),
      ),
    );
    setProposals(
      listVisibleWork<ProjectProposal>(user, "proposal").map((item) => {
        const payload = item.payload as ProjectProposal;
        return {
          ...payload,
          id: payload.id || item.id,
          workId: item.id,
          visibility: item.visibility,
          sharedWithUserIds: item.sharedWithUserIds,
          ownerId: item.ownerId,
          ownerName: item.ownerName,
          canEdit: item.ownerId === user.id,
        };
      }),
    );
    setManagedEvents(
      listVisibleWork<ManagedEvent>(user, "managed_event").map((item) => {
        const payload = item.payload as ManagedEvent;
        return {
          ...payload,
          id: payload.id || item.id,
          workId: item.id,
          visibility: item.visibility,
          sharedWithUserIds: item.sharedWithUserIds,
          ownerId: item.ownerId,
          ownerName: item.ownerName,
          canEdit: item.ownerId === user.id,
        };
      }),
    );
    setEvents(
      listVisibleWork<CalendarEvent>(user, "calendar_event").map((item) => {
        const payload = item.payload as CalendarEvent;
        return {
          ...payload,
          id: payload.id || item.id,
          workId: item.id,
          visibility: item.visibility,
          sharedWithUserIds: item.sharedWithUserIds,
          ownerId: item.ownerId,
          ownerName: item.ownerName,
          canEdit: item.ownerId === user.id,
        };
      }),
    );
  }, [user, tick]);

  function saveSubmission(submission: StrategySubmission, visibility: Visibility = "private") {
    if (!user) throw new Error("Not signed in");
    upsertWorkItem(user, {
      kind: "submission",
      title: submission.answers.ideaTitle,
      payload: submission,
      visibility,
    });
    reload();
  }

  function saveProposal(proposal: ProjectProposal, visibility: Visibility = "private") {
    if (!user) throw new Error("Not signed in");
    upsertWorkItem(user, {
      kind: "proposal",
      title: proposal.projectName,
      payload: proposal,
      visibility,
    });
    reload();
  }

  function saveManagedEvent(event: ManagedEvent, workId?: string, visibility: Visibility = "private") {
    if (!user) throw new Error("Not signed in");
    upsertWorkItem(user, {
      id: workId,
      kind: "managed_event",
      title: event.title,
      payload: event,
      visibility,
    });
    reload();
  }

  function saveCalendarEvent(
    event: CalendarEvent,
    workId?: string,
    visibility: Visibility = "private",
  ) {
    if (!user) throw new Error("Not signed in");
    upsertWorkItem(user, {
      id: workId,
      kind: "calendar_event",
      title: event.title,
      payload: event,
      visibility,
    });
    reload();
  }

  function removeWork(workId: string) {
    if (!user) return;
    softDeleteWork(user, workId);
    reload();
  }

  function shareWork(workId: string, visibility: Visibility, sharedWithUserIds: string[]) {
    if (!user) return;
    updateVisibility(user, workId, visibility, sharedWithUserIds);
    reload();
  }

  return {
    submissions,
    proposals,
    managedEvents,
    events,
    saveSubmission,
    saveProposal,
    saveManagedEvent,
    saveCalendarEvent,
    removeWork,
    shareWork,
    reload,
  };
}

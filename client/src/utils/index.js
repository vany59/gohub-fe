export const fnCopy = data => JSON.parse(JSON.stringify(data));

export const fnCheckMission = (session, missions = []) => {
  if (session.isRoot) return true;
  return missions.some(e =>
    session.missions.find(
      m => m.mission == e.m && m.privileges.indexOf(e.p) >= 0
    )
  );
};

export const fnCheckTeam = (session, teams = []) => {
  return teams.every(e => session.teams.indexOf(e) >= 0);
};

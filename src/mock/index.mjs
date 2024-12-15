const fullMembers = [
  { firstName: 'Ali', lastName: 'Khan', email: 'ali.khan@email.com' },
  { firstName: 'Sara', lastName: 'Ahmed', email: 'sara.ahmed@email.com' },
  { firstName: 'Zain', lastName: 'Malik', email: 'zain.malik@email.com' },
  { firstName: 'Ayesha', lastName: 'Iqbal', email: 'ayesha.iqbal@email.com' },
  { firstName: 'Bilal', lastName: 'Hassan', email: 'bilal.hassan@email.com' },
  ...new Array(8000).fill({ firstName: 'Bilal', lastName: 'Hassan', email: 'bilal.hassan@email.com' })
];

const midweekMembers = [
  { firstName: 'Fatima', lastName: 'Noor', email: 'fatima.noor@email.com' },
  { firstName: 'Usman', lastName: 'Tariq', email: 'usman.tariq@email.com' },
  { firstName: 'Nida', lastName: 'Ali', email: 'nida.ali@email.com' },
  { firstName: 'Imran', lastName: 'Farooq', email: 'imran.farooq@email.com' },
  { firstName: 'Mariam', lastName: 'Zafar', email: 'mariam.zafar@email.com' }
];

const u26Members = [
  { firstName: 'Ravi', lastName: 'Sharma', email: 'ravi.sharma@email.com' },
  { firstName: 'Lina', lastName: 'Singh', email: 'lina.singh@email.com' },
  { firstName: 'Ahmed', lastName: 'Qureshi', email: 'ahmed.qureshi@email.com' },
  { firstName: 'Zara', lastName: 'Jamal', email: 'zara.jamal@email.com' },
  { firstName: 'Tariq', lastName: 'Ali', email: 'tariq.ali@email.com' }
];

const juniorMembers = [
  { firstName: 'Imran', lastName: 'Khan', email: 'imran.khan@email.com' },
  { firstName: 'Saira', lastName: 'Chaudhry', email: 'saira.chaudhry@email.com' },
  { firstName: 'Omar', lastName: 'Ali', email: 'omar.ali@email.com' },
  { firstName: 'Tariq', lastName: 'Hussain', email: 'tariq.hussain@email.com' },
  { firstName: 'Junaid', lastName: 'Zahid', email: 'junaid.zahid@email.com' }
];

const socialMembers = [
  { firstName: 'Maya', lastName: 'Rashid', email: 'maya.rashid@email.com' },
  { firstName: 'Nashit', lastName: 'Mehmood', email: 'nashit.mehmood@email.com' },
  { firstName: 'Areeb', lastName: 'Khan', email: 'areeb.khan@email.com' },
  { firstName: 'Fariha', lastName: 'Bashir', email: 'fariha.bashir@email.com' },
  { firstName: 'Nabeel', lastName: 'Sadiq', email: 'nabeel.sadiq@email.com' }
];

const temporaryMembers = [
  { firstName: 'Raheel', lastName: 'Javed', email: 'raheel.javed@email.com' },
  { firstName: 'Rashid', lastName: 'Niaz', email: 'rashid.niaz@email.com' },
  { firstName: 'Hassan', lastName: 'Shah', email: 'hassan.shah@email.com' },
  { firstName: 'Sana', lastName: 'Raza', email: 'sana.raza@email.com' },
  { firstName: 'Anwar', lastName: 'Iqbal', email: 'anwar.iqbal@email.com' }
];

export const categories = [
  {
    name: 'full',
    members: fullMembers,
  },
  {
    name: 'midweek',
    members: midweekMembers,
  },
  {
    name: 'u26',
    members: u26Members,
  },
  {
    name: 'junior',
    members: juniorMembers,
  },
  {
    name: 'social',
    members: socialMembers,
  },
  {
    name: 'temporary',
    members: temporaryMembers,
  }
];

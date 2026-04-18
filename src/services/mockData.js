import { generateId, getDeadlineForToday, isSameDay } from '../utils'

const today = new Date()
const yesterday = new Date(today); yesterday.setDate(today.getDate()-1)
const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate()-2)

const makeDeadline = (date) => {
  const d = new Date(date); d.setHours(23,59,0,0); return d.toISOString()
}
const makeTime = (date, h, m=0) => {
  const d = new Date(date); d.setHours(h,m,0,0); return d.toISOString()
}

export const MOCK_USER = {
  _id: 'user_001',
  email: 'demo@timebound.app',
  name: 'Alex Morgan',
  occupation: 'Product Designer',
  monthlyGoal: 85,
  createdAt: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
}

export const MOCK_TASKS = [
  { _id: generateId(), userId:'user_001', title:'Design new dashboard wireframes', priority:'Important', creationTime: makeTime(today,9), deadline: makeDeadline(today), status:'Completed', isLocked:false, completedAt: makeTime(today,11) },
  { _id: generateId(), userId:'user_001', title:'Review pull requests', priority:'Urgent', creationTime: makeTime(today,9,30), deadline: makeDeadline(today), status:'Pending', isLocked:false, completedAt:null },
  { _id: generateId(), userId:'user_001', title:'Write weekly blog post', priority:'Medium', creationTime: makeTime(today,10), deadline: makeDeadline(today), status:'Pending', isLocked:false, completedAt:null },
  { _id: generateId(), userId:'user_001', title:'Update component library docs', priority:'Medium', creationTime: makeTime(today,10,15), deadline: makeDeadline(today), status:'Completed', isLocked:false, completedAt: makeTime(today,14) },
  { _id: generateId(), userId:'user_001', title:'Prepare client presentation', priority:'Important', creationTime: makeTime(today,8), deadline: makeDeadline(today), status:'Pending', isLocked:false, completedAt:null },
  // Yesterday
  { _id: generateId(), userId:'user_001', title:'Fix login page bug', priority:'Important', creationTime: makeTime(yesterday,9), deadline: makeDeadline(yesterday), status:'Completed', isLocked:true, completedAt: makeTime(yesterday,10,30) },
  { _id: generateId(), userId:'user_001', title:'Team standup notes', priority:'Medium', creationTime: makeTime(yesterday,9), deadline: makeDeadline(yesterday), status:'Completed', isLocked:true, completedAt: makeTime(yesterday,9,20) },
  { _id: generateId(), userId:'user_001', title:'Deploy hotfix to staging', priority:'Urgent', creationTime: makeTime(yesterday,14), deadline: makeDeadline(yesterday), status:'Pending', isLocked:true, completedAt:null },
  // 2 days ago
  { _id: generateId(), userId:'user_001', title:'Refactor API endpoints', priority:'Important', creationTime: makeTime(twoDaysAgo,9), deadline: makeDeadline(twoDaysAgo), status:'Completed', isLocked:true, completedAt: makeTime(twoDaysAgo,15) },
  { _id: generateId(), userId:'user_001', title:'Write unit tests', priority:'Urgent', creationTime: makeTime(twoDaysAgo,11), deadline: makeDeadline(twoDaysAgo), status:'Completed', isLocked:true, completedAt: makeTime(twoDaysAgo,16) },
  { _id: generateId(), userId:'user_001', title:'Update README', priority:'Medium', creationTime: makeTime(twoDaysAgo,13), deadline: makeDeadline(twoDaysAgo), status:'Pending', isLocked:true, completedAt:null },
]

export const MOCK_PROGRESS = {
  daily: { today: 40, yesterday: 67, twoDaysAgo: 67 },
  monthly: [
    { day:1,progress:80 },{ day:2,progress:60 },{ day:3,progress:100 },
    { day:4,progress:75 },{ day:5,progress:90 },{ day:6,progress:50 },
    { day:7,progress:85 },{ day:8,progress:70 },{ day:9,progress:95 },
    { day:10,progress:65 },{ day:11,progress:88 },{ day:12,progress:72 },
    { day:13,progress:91 },{ day:14,progress:67 },{ day:15,progress:83 },
    { day:16,progress:77 },{ day:17,progress:93 },{ day:18,progress:58 },
    { day:19,progress:86 },{ day:20,progress:74 },
  ],
  yearly: [
    { month:'Jan',progress:72 },{ month:'Feb',progress:68 },{ month:'Mar',progress:81 },
    { month:'Apr',progress:77 },{ month:'May',progress:85 },{ month:'Jun',progress:79 },
    { month:'Jul',progress:91 },{ month:'Aug',progress:83 },{ month:'Sep',progress:76 },
    { month:'Oct',progress:88 },{ month:'Nov',progress:82 },{ month:'Dec',progress:90 },
  ],
}

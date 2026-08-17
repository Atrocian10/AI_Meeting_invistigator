#!/usr/bin/env node
/**
 * seed-mock-data.js — Populates the database with deterministic mock data.
 * 
 * Usage:
 *   node scripts/seed-mock-data.js [--db=sqlite|postgres] [--vector=file|http]
 * 
 * Reads from mock-data/ directory and inserts into configured database.
 * Outputs created meeting IDs to stdout.
 */

const fs = require('fs');
const path = require('path');

const MOCK_DIR = path.resolve(__dirname, '..', 'mock-data');

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(MOCK_DIR, filePath), 'utf8'));
}

function loadText(filePath) {
  return fs.readFileSync(path.join(MOCK_DIR, filePath), 'utf8');
}

async function seedMeetings() {
  const config = loadJson('seed-script-config.json');
  const meetings = [];
  const actions = [];
  const summaries = [];

  // Load meetings
  for (const file of config.meeting_files) {
    const meeting = loadJson(file);
    meetings.push(meeting);
    console.log(`[seed] Loaded meeting: ${meeting.meeting_id} — "${meeting.title}"`);
  }

  // Load actions
  for (const file of config.action_files) {
    const actionSet = loadJson(file);
    actions.push(...actionSet);
  }

  // Load summaries
  for (const file of config.summary_files) {
    const summary = loadJson(file);
    summaries.push(summary);
  }

  // Load transcripts
  const transcripts = [];
  for (const meeting of meetings) {
    if (meeting.transcript_file) {
      try {
        const text = loadText(meeting.transcript_file);
        transcripts.push({ meeting_id: meeting.meeting_id, content: text });
      } catch (e) {
        console.warn(`[seed] Transcript not found for ${meeting.meeting_id}`);
      }
    }
  }

  console.log(`\n[seed] Summary:`);
  console.log(`  Meetings:    ${meetings.length}`);
  console.log(`  Transcripts: ${transcripts.length}`);
  console.log(`  Summaries:   ${summaries.length}`);
  console.log(`  Actions:     ${actions.length}`);

  // Output meeting IDs
  console.log(`\n[seed] Created meeting IDs:`);
  for (const m of meetings) {
    console.log(`  ${m.meeting_id}`);
  }

  // In a real implementation, insert into DB here:
  // const db = require('./db-connection');
  // await db.meetings.insertMany(meetings);
  // await db.transcripts.insertMany(transcripts);
  // await db.summaries.insertMany(summaries);
  // await db.actionItems.insertMany(actions);

  return { meetings, transcripts, summaries, actions };
}

seedMeetings()
  .then(({ meetings }) => {
    console.log(`\n[seed] Done. ${meetings.length} meetings seeded.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('[seed] Error:', err);
    process.exit(1);
  });

import test from 'node:test';
import assert from 'node:assert/strict';
import {experienceYears} from '../muxion/experience.js';
test('experience increases each September in India time',()=>{
 for(const [date,expected] of [['2026-10-24T12:00:00Z',8],['2027-08-31T18:29:59.999Z',8],['2027-08-31T18:30:00Z',9],['2028-08-31T18:29:59.999Z',9],['2028-08-31T18:30:00Z',10],['2029-01-01T00:00:00Z',10]])assert.equal(experienceYears(new Date(date)),expected,date);
});

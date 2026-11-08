import {PaymentError} from './payments.mjs';
import {quizQuestions,MAX_QUIZ_QUESTIONS} from '../muxion/quiz-model.js';
const fail=message=>{throw new PaymentError(400,message);};
export function validateQuiz(quiz){
 if(quiz==null)return {questions:[]};
 if(typeof quiz!=='object'||Array.isArray(quiz))fail('Invalid quiz.');
 const modern=Object.hasOwn(quiz,'questions'),allowed=modern?['questions','revision']:['question','options','answer'];
 if(Object.keys(quiz).some(key=>!allowed.includes(key))||(modern&&!Array.isArray(quiz.questions)))fail('Invalid quiz fields.');
 if(!modern&&(typeof quiz.question!=='string'||!Array.isArray(quiz.options)))fail('Invalid quiz.');
 if(!modern&&!quiz.question.trim()&&quiz.options.some(value=>typeof value!=='string'||value.trim()))fail('Add a question for these answer options.');
 const questions=quizQuestions(quiz);if(questions.length>MAX_QUIZ_QUESTIONS)fail(`A quiz can contain up to ${MAX_QUIZ_QUESTIONS} questions.`);
 const ids=new Set();return {questions:questions.map((q,index)=>{
  const prefix=`Question ${index+1}: `;
  if(!q||typeof q!=='object'||Array.isArray(q)||Object.keys(q).some(key=>!['id','question','options','answer'].includes(key)))fail(prefix+'invalid fields.');
  if(typeof q.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(q.id)||ids.has(q.id))fail(prefix+'use a unique question ID.');ids.add(q.id);
  if(typeof q.question!=='string'||!q.question.trim()||q.question.length>1000)fail(prefix+'enter question text of up to 1,000 characters.');
  if(!Array.isArray(q.options)||q.options.length<2||q.options.length>8||q.options.some(value=>typeof value!=='string'||!value.trim()||value.length>1000))fail(prefix+'add between 2 and 8 non-empty answer options.');
  if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)fail(prefix+'select the correct answer.');
  return {id:q.id,question:q.question.trim(),options:q.options.map(value=>value.trim()),answer:q.answer};
 })};
}
export function learnerQuiz(quiz){return {questions:quizQuestions(quiz).map(q=>({id:q.id,question:q.question,options:[...q.options]})),revision:quiz?.revision||''};}
export function gradeQuiz(quiz,body){
 const questions=validateQuiz(quiz).questions;if(!questions.length)fail('Your tutor has not added quiz questions yet.');
 if(quiz?.revision&&body.quizRevision!==quiz.revision)throw new PaymentError(409,'This quiz has changed. Close it and reopen it to load the latest questions.');
 const answers=body.answers??(questions.length===1&&Number.isInteger(body.answer)?[{questionId:questions[0].id,option:body.answer}]:null);
 if(!Array.isArray(answers)||answers.length!==questions.length)fail('Answer every quiz question before submitting.');
 const byId=new Map();for(const answer of answers){if(!answer||typeof answer!=='object'||Array.isArray(answer)||Object.keys(answer).some(key=>!['questionId','option'].includes(key))||typeof answer.questionId!=='string'||byId.has(answer.questionId)||!Number.isInteger(answer.option))fail('Invalid or duplicate quiz answers.');byId.set(answer.questionId,answer.option);}
 let score=0;for(const q of questions){const answer=byId.get(q.id);if(!Number.isInteger(answer)||answer<0||answer>=q.options.length)fail('Choose a valid answer for every question.');if(answer===q.answer)score++;}
 return {correct:score===questions.length,score,total:questions.length};
}

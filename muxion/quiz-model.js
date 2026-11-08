export const MAX_QUIZ_QUESTIONS=200;
export function quizQuestions(quiz){
 if(Array.isArray(quiz?.questions))return quiz.questions;
 if(typeof quiz?.question==='string'&&quiz.question.trim())return [{id:'legacy-question',question:quiz.question,options:quiz.options||[],...(Number.isInteger(quiz.answer)?{answer:quiz.answer}:{})}];
 return [];
}
export function newQuizQuestion(){return {id:'q-'+crypto.randomUUID(),question:'',options:['','',''],answer:-1};}

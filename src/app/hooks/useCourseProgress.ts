import { useState, useEffect } from "react";
import { courseData } from "../data/courseData";

const STORAGE_KEY_PAYMENT = "figma_course_payment_status";
const STORAGE_KEY_COMPLETED = "figma_course_completed_lessons";
const STORAGE_KEY_PAYMENT_ID = "figma_course_payment_id";

export function useCourseProgress() {
  const [hasPaid, setHasPaid] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_PAYMENT);
    return stored === "true";
  });

  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_COMPLETED);
    return stored ? JSON.parse(stored) : [];
  });

  const [paymentId, setPaymentId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_PAYMENT_ID);
  });

  // Save payment status to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PAYMENT, hasPaid.toString());
  }, [hasPaid]);

  // Save completed lessons to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedLessons));
  }, [completedLessons]);

  // Save payment ID to localStorage
  useEffect(() => {
    if (paymentId) {
      localStorage.setItem(STORAGE_KEY_PAYMENT_ID, paymentId);
    }
  }, [paymentId]);

  const markAsComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const unlockCourse = (razorpayPaymentId?: string) => {
    setHasPaid(true);
    if (razorpayPaymentId) {
      setPaymentId(razorpayPaymentId);
    }
  };

  // Calculate progress percentage
  const totalLessons = courseData.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const progressPercentage = Math.round(
    (completedLessons.length / totalLessons) * 100
  );

  // Get unlocked lessons - if paid, all lessons are unlocked, otherwise only first lesson
  const unlockedLessons = hasPaid
    ? courseData.modules.flatMap((module) => module.lessons.map((l) => l.id))
    : [1]; // Only first lesson is free

  return {
    hasPaid,
    completedLessons,
    unlockedLessons,
    progressPercentage,
    totalLessons,
    completedCount: completedLessons.length,
    paymentId,
    markAsComplete,
    unlockCourse,
  };
}

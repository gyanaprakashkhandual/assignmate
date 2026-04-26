"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PenLine, ArrowRight, Loader2 } from "lucide-react";
import { useProfile } from "@/app/hooks/useProfile.hooks";
import { useOnboard } from "@/app/context/Onboard.context";
import StepUsername from "../Step.user.name";
import StepDetails from "../Step.details";
import StepDone from "../Step.done";
import OnboardProgress from "../Onboard.progress";

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
    const router = useRouter();
    const { create, isLoading } = useProfile(false);
    const { markOnboarded } = useOnboard();

    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [designation, setDesignation] = useState("");
    const [age, setAge] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [submitError, setSubmitError] = useState("");

    const validateUsername = (val: string) => {
        if (!val.trim()) return "Username is required.";
        if (val.length < 3) return "At least 3 characters required.";
        if (val.length > 30) return "Max 30 characters allowed.";
        if (!/^[a-z0-9_]+$/.test(val)) return "Only lowercase letters, numbers, and underscores.";
        return "";
    };

    const handleNext = async () => {
        if (step === 1) {
            const err = validateUsername(username);
            if (err) { setUsernameError(err); return; }
            setUsernameError("");
            setStep(2);
            return;
        }

        if (step === 2) {
            setSubmitError("");
            const result = await create({
                username,
                nickname: nickname || undefined,
                designation: designation || undefined,
                age: age ? parseInt(age) : undefined,
            });

            if (create.rejected && (result as any)?.error) {
                setSubmitError((result as any).payload ?? "Something went wrong. Please try again.");
                return;
            }

            markOnboarded();
            setStep(3);
            return;
        }

        if (step === 3) {
            router.replace("/");
        }
    };

    const buttonLabel = step === 2 ? "Create Profile" : step === 3 ? "Go to Dashboard" : "Continue";

    return (
        <div className="min-h-screen bg-white flex">
            <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-zinc-950 p-12">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                        <PenLine className="w-3.5 h-3.5 text-zinc-900" />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-white">Assignmate</span>
                </div>

                <div className="space-y-6">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <p className="text-3xl font-bold text-white leading-snug">
                            {step === 1 && "Your identity starts here."}
                            {step === 2 && "Make it yours."}
                            {step === 3 && "Ready to create."}
                        </p>
                        <p className="text-sm text-zinc-400 mt-3">
                            {step === 1 && "Pick a username that represents you across all your assignments."}
                            {step === 2 && "Add some details so your experience feels personal."}
                            {step === 3 && "Your handwriting. Zero effort. Let's get started."}
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap gap-2">
                        {["Handwriting AI", "PDF Export", "Zero Effort", "Private"].map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Assignmate. All rights reserved.</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="lg:hidden flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-black flex items-center justify-center">
                                <PenLine className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-bold text-black">Assignmate</span>
                        </div>
                        <OnboardProgress current={step} total={TOTAL_STEPS} />
                        <span className="text-xs text-zinc-400">{step} of {TOTAL_STEPS}</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <div key={step}>
                            {step === 1 && (
                                <StepUsername
                                    value={username}
                                    onChange={setUsername}
                                    error={usernameError}
                                />
                            )}
                            {step === 2 && (
                                <StepDetails
                                    nickname={nickname}
                                    designation={designation}
                                    age={age}
                                    onNicknameChange={setNickname}
                                    onDesignationChange={setDesignation}
                                    onAgeChange={setAge}
                                />
                            )}
                            {step === 3 && (
                                <StepDone username={username} nickname={nickname} />
                            )}
                        </div>
                    </AnimatePresence>

                    {submitError && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                            {submitError}
                        </p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        {step > 1 && step < 3 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="text-sm text-zinc-500 hover:text-black transition-colors"
                            >
                                Back
                            </button>
                        ) : <div />}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleNext}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    {buttonLabel}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
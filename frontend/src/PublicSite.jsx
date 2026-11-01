
import { useCallback, useEffect, useState } from "react";
import { api, track } from "./api";

import Navbar from "./components/pages/Navbar";
import HeroSection from "./components/pages/HeroSection";
import AboutSection from "./components/pages/AboutSection";
import SkillsSection from "./components/pages/SkillsSection";
import ProjectsSection from "./components/pages/ProjectsSection";
import JourneySection from "./components/pages/JourneySection";
import CertificationsSection from "./components/pages/CertificationsSection";
import GithubSection from "./components/pages/GithubSection";
import TerminalSection from "./components/pages/TerminalSection";
import ContactSection from "./components/pages/ContactSection";
import Footer from "./components/pages/Footer";
import Assistant from "./components/Assistant";

const fallbackProfile = {
    name: "Your Name",
    headline: "Building the future with technology",
    bio: "I'm a technology enthusiast exploring software development, data and AI. I enjoy solving real-world problems and building useful digital experiences.",
    email: "hello@example.com",
    location: "Your City",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
};

export default function PublicSite() {
    const [profile, setProfile] = useState(fallbackProfile);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experience, setExperience] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [repositories, setRepositories] = useState([]);

    const [mobile, setMobile] = useState(false);
    const [light, setLight] = useState(false);
    const [status, setStatus] = useState("");

    const [githubElement, setGithubElement] = useState(null);
    const [githubLoaded, setGithubLoaded] = useState(false);

    // Load portfolio data
    useEffect(() => {
        let active = true;

        const loadPortfolio = async () => {
            const results = await Promise.allSettled([
                api("/profile"),
                api("/projects"),
                api("/skills"),
                api("/experience"),
                api("/certifications"),
            ]);

            if (!active) return;

            if (results[0].status === "fulfilled") {
                setProfile({
                    ...fallbackProfile,
                    ...results[0].value,
                });
            }

            if (results[1].status === "fulfilled") {
                setProjects(
                    Array.isArray(results[1].value)
                        ? results[1].value
                        : []
                );
            }

            if (results[2].status === "fulfilled") {
                setSkills(
                    Array.isArray(results[2].value)
                        ? results[2].value
                        : []
                );
            }

            if (results[3].status === "fulfilled") {
                setExperience(
                    Array.isArray(results[3].value)
                        ? results[3].value
                        : []
                );
            }

            if (results[4].status === "fulfilled") {
                setCertifications(
                    Array.isArray(results[4].value)
                        ? results[4].value
                        : []
                );
            }
        };

        loadPortfolio();
        track("view", "home");

        return () => {
            active = false;
        };
    }, []);

    // GitHub section observer
    const githubRef = useCallback((node) => {
        setGithubElement(node);
    }, []);

    useEffect(() => {
        if (!githubElement || githubLoaded) return;

        if (!("IntersectionObserver" in window)) {
            setGithubLoaded(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setGithubLoaded(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: "300px 0px",
                threshold: 0,
            }
        );

        observer.observe(githubElement);

        return () => observer.disconnect();
    }, [githubElement, githubLoaded]);

    // Load GitHub repositories when section approaches viewport
    useEffect(() => {
        if (!githubLoaded) return;

        let active = true;

        api("/github")
            .then((data) => {
                if (active) {
                    setRepositories(data.repositories || []);
                }
            })
            .catch(() => {
                if (active) {
                    setRepositories([]);
                }
            });

        return () => {
            active = false;
        };
    }, [githubLoaded]);

    // Smooth navigation
    const navigateTo = useCallback((sectionId) => {
        const target = document.getElementById(
            String(sectionId).toLowerCase()
        );

        target?.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
                ? "auto"
                : "smooth",
            block: "start",
        });

        setMobile(false);
    }, []);

    // Contact form submission
    async function handleContactSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        setStatus("Sending...");

        try {
            const response = await api("/contact", {
                method: "POST",
                body: JSON.stringify({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    subject: formData.get("subject"),
                    message: formData.get("message"),
                    website: formData.get("website"),
                }),
            });

            setStatus(response.message || "Message received!");
            form.reset();
        } catch (error) {
            setStatus(error.message || "Something went wrong.");
        }
    }

    // Resume tracking
    const handleResume = useCallback(() => {
        track("resume", "resume");
    }, []);

    return (
        <div
            className={`min-h-screen ${light ? "light-mode" : ""
                }`}
        >
            <Navbar
                mobile={mobile}
                setMobile={setMobile}
                light={light}
                setLight={setLight}
                onNavigate={navigateTo}
            />

            <main>
                <HeroSection
                    profile={profile}
                    onNavigate={navigateTo}
                    onResume={handleResume}
                />

                <AboutSection profile={profile} />

                <SkillsSection skills={skills} />

                <ProjectsSection projects={projects} />

                <JourneySection experience={experience} />

                <CertificationsSection
                    certifications={certifications}
                />

                {/* Lazy-loaded GitHub Section */}
                <div id="github" ref={githubRef}>
                    {githubLoaded ? (
                        <GithubSection
                            repositories={repositories}
                        />
                    ) : (
                        <div className="min-h-[200px]" />
                    )}
                </div>

                <TerminalSection />

                <ContactSection
                    profile={profile}
                    status={status}
                    onSubmit={handleContactSubmit}
                />
            </main>

            <Footer profile={profile} />

            <Assistant />
        </div>
    );
}

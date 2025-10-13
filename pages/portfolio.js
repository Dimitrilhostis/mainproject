// portfolio.js
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

function Card({ title, children }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: "0 8px 20px rgba(0,255,140,0.08)",
        borderColor: "var(--green2)",
      }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="card"
      style={{
        background: "var(--details-dark)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.9rem",
        padding: "1.25rem 1.4rem",
        color: "var(--text1)",
        height: "100%",
        transition: "all .3s ease",
      }}
    >
      {title && (
        <h3
          style={{
            fontWeight: 700,
            fontSize: "1.05rem",
            marginBottom: ".6rem",
            background: "var(--premium-gradient)",
            WebkitBackgroundClip: "text",
            color: "var(--premium-light)",
          }}
        >
          {title}
        </h3>
      )}
      <div style={{ fontSize: ".95rem", lineHeight: 1.6, color: "var(--text2)" }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  return (
    <main
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(34,197,94,0.15), transparent 70%), radial-gradient(circle at 80% 80%, rgba(255,217,102,0.1), transparent 70%), var(--background)",
        color: "var(--text1)",
        overflowX: "hidden",
        padding: "3rem 1rem 5rem",
      }}
    >
      {/* HERO */}
      <section
        id="home"
        style={{
          maxWidth: "1100px",
          margin: "0 auto 4rem auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(2rem, 6vw, 3.3rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: ".4rem",
              background: "var(--premium-gradient)",
              WebkitBackgroundClip: "text",
              color: "var(--premium-light)",
            }}
          >
            L&apos;HOSTIS Dimitri
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text2)", marginBottom: ".8rem" }}>
            20 ans • Bordeaux
          </p>
          <p style={{ lineHeight: 1.6, color: "var(--text2)" }}>
            Je recherche un job à côté de mon service civique, jusqu’à fin juillet.
          </p>
          <div
            style={{
              marginTop: "1.25rem",
              display: "flex",
              flexWrap: "wrap",
              gap: ".6rem",
            }}
          >
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              overflow: "hidden",
              borderRadius: "1rem",
              border: "1px solid rgba(255,255,255,0.1)",
              width: "min(90%, 340px)",
              aspectRatio: "4/5",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >
            <Image
              src="/images/photo_cv.png"
              alt="Photo de Dimitri L'Hostis"
              width={340}
              height={440}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </section>

      {/* CONTACT + DISPONIBILITÉS côte à côte */}
      <section
        id="contact"
        style={{
          maxWidth: "1100px",
          margin: "0 auto 3rem auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          alignItems: "stretch",
        }}
      >
        <Card title="Contact">
          <p>
            <Link
              href="mailto:dimit.lhostis@gmail.com?subject=Contact%20depuis%20le%20portfolio"
              style={{ color: "var(--green3)", fontWeight: 500 }}
            >
              dimit.lhostis@gmail.com
            </Link>
            <br />
            07 68 70 43 64
            <br />
            <Link
              href="https://www.linkedin.com/in/dimitri-l-hostis-65a14b32a/"
              target="_blank"
              style={{ color: "var(--premium-light)" }}
            >
              linkedin.com/in/dimitri-l-hostis
            </Link>
          </p>
        </Card>

        <Card title="Disponibilités">
          <ul style={{ listStyle: "none", padding: 0, lineHeight: 1.6 }}>
            <li>Lundi — jusqu’à 15h30</li>
            <li>Mardi — après 13h30</li>
            <li>Jeudi, vendredi, dimanche — toute la journée</li>
            <li>Certains samedis après-midi</li>
          </ul>
        </Card>
      </section>

      {/* SITUATION */}
      <section
        id="situation"
        style={{
          maxWidth: "1100px",
          margin: "0 auto 3rem auto",
          display: "grid",
          gridTemplateColumns: "1fr",
        }}
      >
        <Card title="Situation actuelle">
          En service civique (24h/semaine). <br />
          Objectif : devenir coach sportif & nutritionnel. <br />
          Je cherche un travail complémentaire pour financer mon projet.
        </Card>
      </section>

      {/* EXPÉRIENCE & DIPLÔMES côte à côte */}
      <section
        id="experience"
        style={{
          maxWidth: "1100px",
          margin: "0 auto 3rem auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <Card title="Expériences professionnelles">
          <ul style={{ paddingLeft: "1rem", lineHeight: 1.6 }}>
            <li>Lycée filière scientifique</li>
            <li>1re année d’école d’ingénieur (Polytech)</li>
            <li>Stages en informatique</li>
            <li>Restauration rapide</li>
            <li>Événementiel</li>
          </ul>
        </Card>

        <Card title="Diplômes et certificats">
          <ul style={{ paddingLeft: "1rem", lineHeight: 1.6 }}>
            <li>Baccalauréat — mention assez bien</li>
            <li>BAFA</li>
            <li>Permis B</li>
            <li>BPJEPS en préparation (coach sportif)</li>
          </ul>
        </Card>
      </section>

      {/* QUALITÉS & PASSIONS côte à côte */}
      <section
        id="profil"
        style={{
          maxWidth: "1100px",
          margin: "0 auto 3rem auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <Card title="Qualités humaines">
          <ul style={{ paddingLeft: "1rem", lineHeight: 1.6 }}>
            <li>Autonome & efficace</li>
            <li>À l’écoute et logique</li>
            <li>Sens de l’ordre & fiabilité</li>
            <li>Créatif, avec un côté artistique</li>
          </ul>
        </Card>

        <Card title="Passions & centres d’intérêt">
          <p style={{ lineHeight: 1.6 }}>
            Sport, nutrition, santé, musique, informatique.<br />
            J’aime apprendre, me dépasser et transmettre.
          </p>
        </Card>
      </section>

      {/* LANGUES */}
      <section
        id="langues"
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <Card title="Langues parlées">
          <p style={{ fontSize: "1.05rem" }}>
            🇫🇷 Français — <strong>5/5</strong> <br />
            🇬🇧 Anglais — <strong>3/5</strong>
          </p>
        </Card>
      </section>
    </main>
  );
}

"use client";

import { useState } from 'react';
import Layout from '../components/layout';
import SideBar from '../components/sidebar';
import Card, { CardSpecial } from '../components/cards/card_program'


export default function ProgramsPage() {

  return (
    <Layout>
      <div className="flex w-screen h-screen">
        <SideBar
          minWidth={65}
          maxWidth={250}
          defaultWidth={65}
        />
            {/* Title centered */}
            <h1 className="mx-auto text-4xl font-bold">Ton Programme Perso</h1>
          
      </div>
    </Layout>
  );
}

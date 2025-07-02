'use client';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import BackButton from '../buttons/back_button';
import useAuth from '@/hooks/use_auth';
import { useEffect } from 'react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NutritionProfileCard({ item }) {

  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { user_uuid } = router.query;
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      if (authLoading || !user_uuid) return;
      (async () => {
        setLoading(true);
        const { data: nutData, error: nutError } = await supabase
          .from('nutrition_profiles')
          .select('*')
          .eq('user_id', user_uuid)
          .limit(1);
        const { data: sportData, error: sportError } = await supabase
          .from('sport_profiles')
          .select('*')
          .eq('user_id', user_uuid)
          .limit(1);
        if (nutError) console.error('Erreur nutrition_profiles:', nutError.message);
        if (sportError) console.error('Erreur sport_profiles:', sportError.message);
        setLoading(false);
      })();
    }, [authLoading, user_uuid]);

  const viewHref = `/admin/programs/${item.user_id}`;
  const displayEmail = authUser?.email;

  return (
    <div>
      <div
        className="bg-white rounded-t-lg shadow p-4 flex flex-col cursor-pointer"
        onClick={() => router.push(viewHref)}
      >
        <h3 className="font-bold text-lg mb-2">Profile for : {displayEmail}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">Needs: {item.needs}</p>
      </div>
    </div>
  );
}

NutritionProfileCard.propTypes = {
  item: PropTypes.shape({
    user_id: PropTypes.string.isRequired,
    needs: PropTypes.string,
    uuid: PropTypes.string.isRequired,
  }).isRequired,
};

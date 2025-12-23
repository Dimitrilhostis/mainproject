export async function getServerSideProps(ctx) {
    const { uuid } = ctx.params || {};
  
    if (!uuid) {
      return { notFound: true };
    }
  
    // TODO: fetch recette depuis Supabase (ou autre)
    // Si pas trouvée => return { notFound: true };
  
    return {
      props: {
        uuid,
      },
    };
  }
  
  export default function RecipePage({ uuid }) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Recette {uuid}</h1>
      </main>
    );
  }
  
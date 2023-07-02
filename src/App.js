import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import { useEffect, useState } from 'react';
import { getPokemon } from './api/getPokemon';
import PokemonList from './components/PokemonList';
import Pagination from './components/Pagination';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('https://pokeapi.co/api/v2/pokemon');
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      let cancel

      const data = {
        url: currentPage
      }

      const res = await getPokemon(data, cancel)
      setNextPageUrl(res.next)
      setPrevPageUrl(res.previous)
      setPokemon(res.results.map(p => p.name))
      setLoading(false);

      return () => cancel()
    }

    fetchData()
  }, [currentPage])

  function setNextPage() {
    setCurrentPage(nextPageUrl);
  }

  function setPrevPage() {
    setCurrentPage(prevPageUrl);
  }

  if (loading) {
    return "Loading..."
  }

  return (
    <>
      <PokemonList pokemon={pokemon} />
      <Pagination
        setNextPage={nextPageUrl ? setNextPage : null}
        setPrevPage={prevPageUrl ? setPrevPage : null} />
    </>
  )
}

export default App;

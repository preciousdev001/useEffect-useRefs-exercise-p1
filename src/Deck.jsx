import react, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";
// use deck API, draw 1 card at a time

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(function loadDeckFromAPI() {
    async function fetchData() {
      const d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(d.data);
    }
    fetchData();
  }, []);

  //   draw card - changes state & effect
  async function draw() {
    try {
      const drawRes = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);

      if (drawRes.data.remaining === 0) throw new Error("Deck empty!");

      const card = drawRes.data.cards[0];

      setDrawn((d) => [
        ...d,
        {
          id: card.code,
          name: card.suit + " " + card.value,
          image: card.image,
        },
      ]);
    } catch (err) {
      alert(err);
    }
  }
  //   shuffle cards - change state and effect

  async function Shuffling() {
    setIsShuffling(true);
    try {
      await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
      setDrawn([]);
    } catch (err) {
      alert(err);
    } finally {
      setIsShuffling(false);
    }
  }

  //   return draw (disabled if shuffle)

  function renderDrawBtn() {
    if (!deck) return null;

    return (
      <button className="Deck-gimme" onClick={draw} disabled={isShuffling}>
        DRAW
      </button>
    );
  }

  //   sreturn shuffle (disabled if aleady is)

  function renderShuffleBtn() {
    if (!deck) return null;
    return (
      <button className="Deck-gimme" onClick={Shuffling} disabled={isShuffling}>
        SHUFFLE DECK
      </button>
    );
  }

  return (
    <main className="Deck">
      {renderDrawBtn()}
      {renderShuffleBtn()}

      <div className="Deck-cardarea">
        {drawn.map((c) => (
          <Card key={c.id} name={c.name} image={c.image} />
        ))}
      </div>
    </main>
  );
}

export default Deck;

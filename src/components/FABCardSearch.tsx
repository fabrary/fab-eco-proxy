import React, { useEffect, useState } from "react";
import FABCard from "./FABCard";
import { CardsDB } from "../db/cardDB";
import { Col, Container, InputGroup, Row } from "react-bootstrap";
import EcoProxyCard from "../db/interfaces";
import { Card } from "fab-cards";

interface FABCardSearchProps {
  addCardToPrint: (card: EcoProxyCard) => void;
  addedCards: EcoProxyCard[];
}

export default function FABCardSearch(props: FABCardSearchProps) {
  const { addCardToPrint, addedCards } = props;
  const [searchTerm, setSearchTerm] = useState("fyen");
  // const [results, setResults] = useState<Index.Result[]>([]);
  const [results, setResults] = useState<Card[]>([]);
  const handleChange = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    // const queryString = "*" + searchTerm.trim().split(" ").join("* *") + "*";
    // const res =
    //   searchTerm === "" ? [] : cardDB.search(queryString).slice(0, 20);
    const res = CardsDB.getInstance().searchCards(searchTerm.trim());
    setResults(res);
  }, [searchTerm]);

  const idCountMap = addedCards.reduce((res, card) => {
    let quantity = 0;
    if (res[card.cardIdentifier]) {
      quantity += res[card.cardIdentifier];
    }
    return { ...res, [card.cardIdentifier]: quantity + 1 };
  }, {} as { [x: string]: number });

  return (
    <div className="card-search">
      <div className="card-search-header">
        <InputGroup>
          <InputGroup.Text>Search For Cards:</InputGroup.Text>

          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(event) => handleChange(event.target.value)}
          />
        </InputGroup>
      </div>
      <Container>
        <Row>
          {results.map((res, i) => (
            <Col md="3" xl="2" key={res.cardIdentifier}>
              <FABCard
                card={res}
                addCardToPrint={addCardToPrint}
                fromSearch={true}
                quantity={idCountMap[res.cardIdentifier]}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

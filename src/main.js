import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';


class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      floor_parking: [],
      show_parking: false,
    }
  }

  fetch_parking = (floor_level) => {
    const base_api_url = 'http://localhost:3000/';

    fetch(base_api_url + 'parking/' + floor_level + '/for-floor-level')
      .then(res => res.json())
      .then(results => {
        if (results) {
          this.setState({
            floor_parking: { ...results.data },
            show_parking:  true
          })
          console.log('data -> ', this.state);
        } else {
          console.log('sorry no parking available');
        }
      })
      .catch(e => {
        console.log(e);
      })

  }
  render() {
    console.log("click spacing ", this.state.floor_parking)
    return (
      <div className="container">
        <Row>
          <Col xs={12} md={2}></Col>
          <Col xs={12} md={8}>
            <div className="app-header">
              <Row className="v-spacer">
                <Col xs={12} md={8}>
                  <Row>
                    <h1>
                      Select Level For Parking Overview
                    </h1>
                  </Row>
                </Col>
                <Col xs={12} md={4}>
                  <Row className="text-right">
                    <Button className="primary">
                      Find Next Parking
                    </Button>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col
                  onClick={() => this.fetch_parking(1)}
                  className="level-box"
                  xs={12}
                  md={4}
                >
                  Level 1
                </Col>
                <Col
                  onClick={() => this.fetch_parking(2)}
                  className="level-box"
                  xs={12}
                  md={4}
                >
                  Level 2
                </Col>

                <Col
                  onClick={() => this.fetch_parking(3)}
                  className="level-box"
                  xs={12}
                  md={4}
                >
                  Level 3
                </Col>
              </Row>
              <Row>
                {
                  this.state.show_parking === true
                    ?
                    this.state.floor_parking.map(parking => {
                      return (
                        <Row>
                          <Col xs={12} md={1}>
                            {parking}
                          </Col>
                        </Row>
                      )
                    })
                    :
                    null
                }
              </Row>
            </div>
          </Col>
          <Col xs={12} md={2}></Col>
        </Row>
      </div>
    );
  }
}

export default Main;

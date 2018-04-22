import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { app_config } from './utils/config';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      floor_parking: [],
      show_parking: false,
      active_level: 0,
      show_assign_parking_modal: false,
      show_next_available_parking_modal: false,
      parking_spot_key: 0,
      vehicle_sizes: [],
      selected_vehicle_size: 0,
      selected_vehicle_brand: '',
      available_parking_spot_by_size: {},
      show_available_parking_btn: false,
    }

    this.handle_input_update = this.handle_input_update.bind(this);

  }

  handle_input_update = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  fetch_parking_by_level = (floor_level) => {
    fetch(app_config.base_api_url + 'parking/' + floor_level + '/for-floor-level')
      .then(res => res.json())
      .then(results => {
        if (results) {
          this.setState({
            floor_parking: results.data,
            show_parking: true,
            active_level: floor_level,
          })
        }
      })
      .catch(e => {
        console.log(e);
      })

  }

  fetch_parking_by_vehicle_size = (brand, vehicle_size) => {
    const data = { brand, vehicle_size };

    let post_data = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }

    fetch(app_config.base_api_url + 'parking/find-spot', post_data)
      .then(res => res.json())
      .then(results => {
        if (results) {
          this.setState({
            available_parking_spot_by_size: {
              price: results.data[2],
              spot: results.data[0],
              level: results.data[1],
            },
            show_available_parking_btn: true
          })
        }
      })
      .catch(e => {
        console.log(e);
      })
  }

  book_parking_by_size = () => {
    const vehicle_size = this.state.selected_vehicle_size;
    const vehicle_brand = this.state.selected_vehicle_brand;
    const price_for_parking = this.state.available_parking_spot_by_size.price;
    const parking_spot = this.state.available_parking_spot_by_size.spot;
    const parking_spot_level = this.state.available_parking_spot_by_size.level;
    const data = { vehicle_brand, vehicle_size, price_for_parking, parking_spot, parking_spot_level };

    this.close_modal();


    let post_data = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }

    fetch(app_config.base_api_url + 'parking/book-by-size', post_data)
      .then(res => res.json())
      .then(results => {
        if (results) {
          console.log('processing..');
        }
      })
      .catch(e => {
        console.log(e);
      })
  }

  book_parking_spot = () => {
    const vehicle_brand = this.state.selected_vehicle_brand;
    const parking_spot = this.state.parking_spot_key;
    const parking_spot_level = this.state.active_level;
    const data = { vehicle_brand, parking_spot, parking_spot_level };

    this.close_assign_parking_modal();


    let post_data = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }

    fetch(app_config.base_api_url + 'parking/book-by-spot', post_data)
      .then(res => res.json())
      .then(results => {
        if (results) {
          console.log('processing..');
        }
      })
      .catch(e => {
        console.log(e);
      })
  }

  close_modal = () => {
    this.setState({
      show_assign_parking_modal: false,
      show_next_available_parking_modal: false,
      available_parking_spot_by_size: {},
      selected_vehicle_size: 0,
      show_available_parking_btn: false
    });
  }

  close_assign_parking_modal = () => {
    this.setState({
      show_assign_parking_modal: false,
    });
  }

  assign_parking = (key) => {
    this.setState({
      show_assign_parking_modal: true,
      parking_spot_key: key + 1,
    })
  }

  next_available_parking = () => {
    this.setState({ show_next_available_parking_modal: true })
  }

  update_vehicle_size = (event, index, value) => {
    this.setState({ selected_vehicle_size: value });
    this.fetch_parking_by_vehicle_size(this.state.selected_vehicle_brand, value);
  };

  render() {
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
                    <Button className="primary" onClick={() => this.next_available_parking()}>
                      Find Available Parking
                    </Button>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col
                  onClick={() => this.fetch_parking_by_level(1)}
                  className={this.state.active_level === 1 ? 'level-box active' : 'level-box'}
                  xs={12}
                  md={4}
                >
                  Level 1
                </Col>
                <Col
                  onClick={() => this.fetch_parking_by_level(2)}
                  className={this.state.active_level === 2 ? 'level-box active' : 'level-box'}
                  xs={12}
                  md={4}
                >
                  Level 2
                </Col>

                <Col
                  onClick={() => this.fetch_parking_by_level(3)}
                  className={this.state.active_level === 3 ? 'level-box active' : 'level-box'}
                  xs={12}
                  md={4}
                >
                  Level 3
                </Col>
              </Row>
              <Row className="parking-spaces-wrapper">
                {
                  this.state.show_parking === true
                    ?
                    this.state.floor_parking.map((parking, key) => {
                      return (
                        <Col
                          onClick={() => this.assign_parking(key)}
                          key={key}
                          xs={12}
                          md={1}
                          className={parking !== 0 ? 'parking no-parking' : 'parking'}
                        >
                          {key + 1}
                        </Col>
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
        <Dialog
          title={`Book Parking Spot ${this.state.parking_spot_key} on Level #${this.state.active_level}`}
          modal={false}
          open={this.state.show_assign_parking_modal}
          onRequestClose={this.close_assign_parking_modal}
        >
          <TextField
            name="selected_vehicle_brand"
            hintText="Vehicle Brand"
            floatingLabelText="Vehicle Brand"
            fullWidth={true}
            onChange={this.handle_input_update}
          />
          <Row>
            <Col xs={12}>
              <Button onClick={() => this.book_parking_spot()} className="btn btn-success col-xs-12">
                Book
              </Button>
            </Col>
          </Row>
        </Dialog>
        <Dialog
          title="Next Available Parking"
          modal={false}
          open={this.state.show_next_available_parking_modal}
          onRequestClose={this.close_modal}
          autoScrollBodyContent={true}
        >
          <TextField
            name="selected_vehicle_brand"
            hintText="Vehicle Brand"
            floatingLabelText="Vehicle Brand"
            fullWidth={true}
            onChange={this.handle_input_update}
          />
          <SelectField
            floatingLabelText="Vehicle Size"
            value={this.state.selected_vehicle_size}
            onChange={this.update_vehicle_size}
            fullWidth={true}
          >
            <MenuItem value={10} primaryText="10" />
            <MenuItem value={15} primaryText="15" />
            <MenuItem value={20} primaryText="20" />
            <MenuItem value={25} primaryText="25" />
            <MenuItem value={30} primaryText="30" />
            <MenuItem value={45} primaryText="45" />
          </SelectField>
          {
            this.state.show_available_parking_btn
              ?
              <div>
                <Row>
                  <Col xs={12} md={2}>
                    <h3>Price: </h3>
                  </Col>
                  <Col xs={12} md={10}>
                    <h3>
                      {this.state.available_parking_spot_by_size.price}
                    </h3>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={2}>
                    <h3>Level: </h3>
                  </Col>
                  <Col xs={12} md={10}>
                    <h3>
                      {this.state.available_parking_spot_by_size.level}
                    </h3>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={2}>
                    <h3>Spot: </h3>
                  </Col>
                  <Col xs={12} md={10}>
                    <h3>
                      {this.state.available_parking_spot_by_size.spot}
                    </h3>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Button onClick={() => this.book_parking_by_size()} className="btn btn-success col-xs-12">
                      Book
                    </Button>
                  </Col>
                </Row>
              </div>
              :
              null
          }
        </Dialog>
      </div>
    );
  }
}

export default Main;

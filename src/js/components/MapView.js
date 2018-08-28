import { viewCreated
        // getItemInfo,
        // initialize
      } from 'js/actions/mapActions';
import {
  // MAP_OPTIONS,
  VIEW_OPTIONS
} from 'js/config';
import LocateModal from 'js/components/modals/Locate';
import ShareModal from 'js/components/modals/Share';
import Spinner from 'js/components/shared/Spinner';
import Controls from 'js/components/Controls';
import Footer from './Footer';
import MapView from 'esri/views/MapView';
import MapImageLayer from 'esri/layers/MapImageLayer';
import React, { Component } from 'react';
import appStore from 'js/appStore';
import EsriMap from 'esri/Map';

export default class Map extends Component {
  // displayName: 'Map';
  /*
  Initial State: 100,000 population value
  */
  constructor(props) {
    super(props);
    this.state = {
      value: 150000,
      initialLoad: true
    };
    this.handleChange = this.handleChange.bind(this);
  }
  state = appStore.getState();
  view = {};
  map = {};
  layer = {};

  /*
  updateMap variable was created as the primary variable to adjust
  any layers and sublayers of the map. This function is triggered on
  componentDidMount() as well as when the user drags the slider on the
  UI to filter population.
  */

  updateMap(value) {
    console.log(this.layer.findSublayerById(0));
    this.layer.findSublayerById(0).definitionExpression = `pop2000 > ${value}`;
  }


  componentDidMount() {
    this.layer = new MapImageLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
      sublayers: [
      {
        id: 3,
        visible: false
      },
      {
        id: 2,
        visible: true,
        popupTemplate: {
          title: '{state_name}',
          content: '{state_name}s population was {pop2000} in 2000'
        }
      },
      {
        id: 1,
        title: 'Highway Information',
        visible: true,
        popupTemplate: {
          title: '{route}'
        }
      },
      {
        id: 0,
        visible: true,
        definitionExpression: `pop2000 > ${this.state.value}`,
        popupTemplate: {
          title: '{areaname}, {st}',
          content: '{pop2000} people lived in {areaname}, {st} in 2000'
        }
      }]
    });
    this.map = new EsriMap({
      basemap: 'satellite',
      layers: [this.layer]
    });

    // Create map view
    const promise = new MapView({
      container: this.refs.mapView,
      map: this.map,
      ...VIEW_OPTIONS
    });

    promise.then(view => {
      this.view = view;
      this.setState({initialLoad: false});
      appStore.dispatch(viewCreated());
    });
  }

  handleChange(event) {
    if (event.target.value === undefined) {
      console.log('NULL');
    }
    this.setState({value: event.target.value});
    this.updateMap(event.target.value);
    // return false;
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  storeDidUpdate = () => {
    this.setState(appStore.getState());
  };

  render () {
    const {shareModalVisible, locateModalVisible} = this.state;
    return (
      <div ref='mapView' className='map-view'>
        <Controls view={this.view} />
        <Spinner active={this.state.initialLoad} />
        <ShareModal visible={shareModalVisible} />
        <LocateModal visible={locateModalVisible} />
        <Footer population={this.state.value} handleChange={this.handleChange} />
      </div>
    );
  }
}

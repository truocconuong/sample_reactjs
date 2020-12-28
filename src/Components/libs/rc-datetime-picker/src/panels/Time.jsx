import React, {Component} from 'react';
import ReactSlider from 'react-slider';
import moment from 'moment';

var m = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"]
var h = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moment: this.getCurrentMoment(props)
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      moment: this.getCurrentMoment(props)
    });
  }

  getCurrentMoment = (props) => {
    const {range, rangeAt} = props;
    let result = props.moment;

    if (result) {
      if (range) {
        result = result[rangeAt] || moment().hours(0).minutes(0);
      }
    } else {
      result = moment().hours(0).minutes(0);
    }

    return result;
  }

  handleChange = (type, event) => {
    var value = event.target.value
    const {onChange, range, rangeAt} = this.props;
    const _moment = this.state.moment.clone();
    let selected = this.props.moment;
    _moment[type](value);
    if (range) {
      const copyed = selected ? Object.assign(selected, {}) : {};

      copyed[rangeAt] = _moment;
    } else {
      selected = _moment;
    }

    this.setState({
      moment: _moment
    });
    onChange && onChange(selected);
  }

  render() {
    const _moment = this.state.moment;
    const {style} = this.props;

    return (
      <div style={style}>
        <div className="time">
         
          <div className="sliders-time-picker">
            <select className="hoursselect" value={_moment.hour()} onChange={this.handleChange.bind(this, 'hours')} >
              {h.map((item, i) => {     
                 return (<option key={i} value={i} >{item}</option>) // add new key
              })}
            </select>

            <span className="slider-textx">:</span>
              <select className="minuteselect" value={_moment.minute()} onChange={this.handleChange.bind(this, 'minutes')}>
              {m.map((item, i) => {     
                 return (<option key={i} value={i}>{item}</option>) // add new key
              })}
            </select>
          </div>
        </div>
      </div>
    );
  }
}


export default Time;

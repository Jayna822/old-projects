import React from 'react';

const names = ['Jayna','Michelle','Donna','Tilly'];

const foods = {
    'pizza':'that\'s no good for you',
    'avocado': 'oh, I love those too!',
    'sushi': 'yes, sushi is amazing'
};

export class Child extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange_2 = this.handleChange_2.bind(this);
    }
    handleChange(e) {
        const name = e.target.value;
        this.props.onChange(name);
    }
    handleClick(e) {
        this.props.onClick();
    }
    handleChange_2(e) {
        const food = e.target.value;
        this.props.onChange2(food);
    }
    render() {
        return (
            <div>
                <select id="great-names" onChange={this.handleChange}>
                  {names.map(function(name) {
                      return (
                        <option value={name}>
                            {name}
                        </option>
                      );
                  })}
                </select>
                <br/>
                <br/>
                <button onClick={this.handleClick}>
                    Click me!
                </button>
                <h4>
                    Number of times button has been clicked: {this.props.numberOfClicks}
                </h4>
                <br/>
                <br/>
                <h3>What is your favorite food?</h3>
                <select onChange={this.handleChange_2}>
                    {Object.keys(foods).map(function(food) {
                        return (
                            <option value={food}>
                                {food}
                            </option>
                        );
                    })}
                </select>
                <br/>
                <p>{foods[this.props.food]}</p>
              </div>
        );
    }
}

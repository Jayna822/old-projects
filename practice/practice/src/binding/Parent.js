import React from 'react';
import ReactDOM from 'react-dom';
import { Child } from './Child';
import { Sibling } from './Sibling';

export class Parent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: 'Jayna', numberOfClicks: 0, food: 'pizza'};
        this.changeName = this.changeName.bind(this);
        this.incrementClicks = this.incrementClicks.bind(this);
        this.changeFood = this.changeFood.bind(this);
    }
    changeName(newName) {
        this.setState({name: newName});
    }
    changeFood(newFood) {
        this.setState({food: newFood});
    }
    incrementClicks() {
        let clicks = this.state.numberOfClicks;
        this.setState({numberOfClicks: clicks+1});
    }
    render() {
        return (
            <div>
                < Child
                     onChange={this.changeName}
                     onChange2={this.changeFood}
                     onClick={this.incrementClicks}
                     food={this.state.food}
                     numberOfClicks={this.state.numberOfClicks}
                />
                < Sibling name={this.state.name}/>
            </div>
        )
    }
}

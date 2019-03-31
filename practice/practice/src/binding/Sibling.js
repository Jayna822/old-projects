import React from 'react';

export class Sibling extends React.Component {
    render() {
        return (
            <h1>
              Hey my name is {this.props.name}!
            </h1>
        );
    }
}

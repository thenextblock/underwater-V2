import React from 'react';
import Consumer from './Consumer';

export function ContextWrapper(WrappedComponent) {
    return function Wrapper(props) {
        return(
            <Consumer>
                { value => (
                    <WrappedComponent {...props} {...value} />
                )}
            </Consumer>
        )
    }
}

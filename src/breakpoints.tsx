import React, {
	Component,
	createContext,
	ReactNode,
	ReactNodeArray,
	FC,
	ReactElement,
	useContext,
} from 'react';

export type Breakpoint = {
	at: string;
	name: string;
};

type ProviderProps = {
	breakpoints: Breakpoint[];
	children: ReactNode | ReactNodeArray;
};

type State = {
	current: string;
};

const Context = createContext('');

export { Context as BreakpointContext };

const Consumer = Context.Consumer;

class Provider extends Component<ProviderProps, State> {
	static defaultProps = {
		invert: false,
	};

	state = {
		current: '',
	};

	public componentDidMount() {
		const { handleMatchMediaOnResize } = this;
		this.setState({
			current: this.props.breakpoints[this.props.breakpoints.length - 1]
				.name,
		});
		handleMatchMediaOnResize();
		window.addEventListener('resize', handleMatchMediaOnResize, false);
	}

	public componentWillUnmount() {
		window.removeEventListener('resize', this.handleMatchMediaOnResize);
	}

	protected handleMatchMediaOnResize = () => {
		const { breakpoints } = this.props;

		for (let i = 0; i < breakpoints.length; i++) {
			const breakpoint = breakpoints[i];

			const match = window.matchMedia(`(max-width: ${breakpoint.at})`)
				.matches;
			if (match) {
				this.setState({ current: breakpoint.name });
				return;
			}
		}
	};

	public render(): JSX.Element {
		const { children } = this.props;
		const { current } = this.state;

		return <Context.Provider value={current}>{children}</Context.Provider>;
	}
}

export { Consumer, Provider };

export const DisplayOnBreakpoint: FC<{ when: string[] }> = ({
	children,
	when,
}): ReactElement | null => {
	const size = useContext(Context);

	for (let i = 0; i < when.length; i++) {
		if (size === when[i]) {
			return <>{children}</>;
		}
	}

	return null;
};

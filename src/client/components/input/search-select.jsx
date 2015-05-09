var React = require('react');
var Select = require('./select.jsx');
var _ = require('underscore');
var $ = require('jquery');

var SearchSelect = React.createClass({
	getValue: function() {
		return this.refs.select.getValue();
	},
	render: function() {
		var self = this;

		var select2Options = {
			minimumInputLength: 1,
			ajax: {
				url: '/search',
				data: function(params) {
					var queryParams = {
						q: params.term,
						page: params.page,
						mode: 'auto',
						collection: self.props.collection
					};

					return queryParams;
				},
				processResults: function(results) {
					var data = {
						results: []
					};

					if (results.error) {
						data.results.push({
							id: null,
							text: results.error
						});

						return data;
					}

					results.forEach(function(result) {
						data.results.push({
							id: result.bbid,
							text: result.default_alias ?
								  result.default_alias.name : '(unnamed)',
							disambiguation: result.disambiguation ?
								            result.disambiguation.comment : null
						});
					});

					return data;
				}
			},
			templateResult: function(result) {
				var template = result.text;

				if (result.disambiguation) {
					template += React.renderToStaticMarkup(
						<span
							className='disambig'>
							({result.disambiguation})
						</span>
					);
				}

				return $.parseHTML(template);
			}
		};

		_.extend(select2Options, this.props.select2Options);

		var options = this.props.options || [];

		if (this.props.defaultValue) {
			options.unshift(this.props.defaultValue);
			var defaultKey = this.props.defaultValue.id;
		}

		return (
			<Select
				placeholder={this.props.placeholder}
				value={this.props.value}
				defaultValue={defaultKey}
				label={this.props.label}
				idAttribute='id'
				labelAttribute='text'
				help={this.props.help}
				bsStyle={this.props.bsStyle}
				ref='select'
				groupClassName={this.props.groupClassName}
				wrapperClassName={this.props.wrapperClassName}
				labelClassName={this.props.labelClassName}
				noDefault
				onChange={this.props.onChange}
				select2Options={select2Options}
				options={options}/>
		);
	}
});

module.exports = SearchSelect;

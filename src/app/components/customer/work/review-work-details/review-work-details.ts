import { Component } from '@angular/core';

@Component({
  selector: 'review-work-details',
  templateUrl: './review-work-details.html'
})

export class Customer_ReviewWorkDetails {
	code1 = `<h1>h1. Heading 1</h1>
<h2>h2. Heading 2</h2>
<h3>h3. Heading 3</h3>
<h4>h4. Heading 4</h4>
<h5>h5. Heading 5</h5>
<h6>h6. Heading 6</h6>
`;

	code2 = `<small>This line of text is meant to be treated as fine print.</small>
<em>rendered as italicized text</em>
<span class="semi-bold">rendered as semi bold text</span>
<strong>rendered as bold text</strong>
`;

	code3 = `<p class="text-start">Left aligned text.</p>
<p class="text-center">Center aligned text.</p>
<p class="text-end">Right aligned text.</p>
`;

	code4 = `<p class="text-muted">...</p>
<p class="text-warning">...</p>
<p class="text-danger">...</p>
<p class="text-info">...</p>
<p class="text-success">...</p>
`;

	code5 = `<ul>
  <li>Lorem ipsum dolor sit amet</li>
  <li>
    Nulla volutpat aliquam velit
    <ul>
      <li>Phasellus iaculis neque</li>
      ...
    </ul>
  </li>
  ...
</ul>
`;

	code6 = `<ol>
  <li>Lorem ipsum dolor sit amet</li>
  <li>Consectetur adipiscing elit</li>
  ...
</ol>
`;

	code7 = `<!-- list unstyled -->
<ul class="list-unstyled">
  <li>Lorem ipsum dolor sit amet</li>
  ...
</ul>

<!-- list inline -->
<ul class="list-inline">
  <li class="list-inline-item">Lorem ipsum dolor sit amet</li>
  ...
</ul>
`;

	code8 = `<p>
  Quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.
</p>
`;

	code9 = `<p class="lead">
  Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.
</p>
`;

	code10 = `An abbreviation of the word attribute is  
<abbr title="attribute">attr</abbr>
                        
<abbr title="HyperText Markup Language" class="initialism">HTML</abbr> 
is the best thing since sliced bread.
`;

	code11 = `<address>
  <strong>Twitter, Inc.</strong><br />
  795 Folsom Ave, Suite 600<br />
  San Francisco, CA 94107<br />
  <abbr title="Phone">P:</abbr> (123) 456-7890
</address>
<address>
<strong>Full Name</strong><br />
  <a href="mailto:#">first.last@example.com</a>
</address>
`;

	code12 = `<blockquote class="blockquote">
  <p>...</p>
  <footer class="blockquote-footer">
    Someone famous <cite title="Source Title">Source Title</cite>
  </footer>
</blockquote>
<blockquote class="blockquote text-end">
  ...
</blockquote>
`;

	code13 = `<dl>
  <dt class="text-inverse">Description Title</dt>
  <dd>A description list...</dd>
  <dt class="text-inverse mt-10px">Description Title</dt>
  <dd>A description list....</dd>
  <dd>A description list...</dd>
  <dt class="text-inverse mt-10px">Description Title</dt>
  <dd>A description list...</dd>
</dl>
`;

	code14 = `<dl>
  <dt>Description Title</dt>
  <dd>A description list...</dd>
  ...
</dl>
`;
}
